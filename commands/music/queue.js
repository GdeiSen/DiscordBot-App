const embedGenerator = require("../../include/utils/embedGenerator")
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports.run = async (client, message, args) => {
  let currentPage = 0;
  let messageIndex;
  const queue = message.client.queue.get(message.guild.id);
  const permissions = message.channel.permissionsFor(message.client.user);

  let embed4 = await embedGenerator.run('music.play.error_04');
  if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
    return message.reply({
      embeds: [embed4]
    });
  message.channel.activeCollector = true;
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('back')
        .setEmoji('◀️')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('next')
        .setEmoji('▶️')
        .setStyle('PRIMARY'),
    );
  const embeds = await generateQueueEmbed(message, queue.songs, queue.current);
  let queueEmbed = await message.channel.send({
    content: 'Queue',
    embeds: [embeds[currentPage]],
    components: [row]
  });
  const filter = i => i.customId === 'next' || i.customId === 'back';
  collector = message.channel.createMessageComponentCollector({
    filter,
    time: 15000
  });
  try {
    collector.on('collect', async i => {
      if (i.customId === 'next') {
        messageIndex = i;
        if (currentPage < embeds.length - 1) {
          currentPage++;
          await i.update({
            content: `**page - ${currentPage + 1}/${embeds.length}**`,
            embeds: [embeds[currentPage]]
          });
        } else {
          i.deferUpdate();
        }
      } else if (i.customId === 'back') {
        if (currentPage !== 0) {
          --currentPage;
          await i.update({
            content: `**page - ${currentPage + 1}/${embeds.length}**`,
            embeds: [embeds[currentPage]]
          });
        } else {
          i.deferUpdate();
        }
      }
    });
  } catch (err) { console.log(err) };
  collector.on('end', async i => {
    message.channel.activeCollector = false;
    queueEmbed.edit({
      content: `**page - ${currentPage + 1}/${embeds.length}**`,
      embeds: [embeds[currentPage]],
      components: []
    })
  })
}

async function generateQueueEmbed(message, queue, current_) {
  let embeds = [];
  let k = 10;
  let currentSong = current_;
  if (queue.length == 0) {
    let embed = await embedGenerator.run('music.queue.info_02');
    embed
      .setThumbnail(currentSong.thumbnail)
      .setDescription(`**${embed.description} - [${currentSong.title}](${currentSong.url})**\n\nEmpty!`)
      .setTimestamp();
    embeds.push(embed);
  } else {
    for (let i = 0; i < queue.length; i += 10) {
      const current = queue.slice(i, k);
      let j = i;
      k += 10;
      const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");
      let embed = await embedGenerator.run('music.queue.info_02');
      embed
        .setThumbnail(currentSong.thumbnail)
        .setDescription(`**${embed.description} - [${currentSong.title}](${currentSong.url})**\n\n${info}`)
        .setTimestamp();
      embeds.push(embed);
    }
  }
  return embeds;
}

module.exports.config = {
  name: "queue",
  usage: "~queue",
  description: "Displays the status of the current queue",
  accessableby: "Members",
  aliases: ['q','qu','que'],
  category: "music",
  accesTest: "collector-music-command"
}