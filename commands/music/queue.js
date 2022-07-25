const { MessageActionRow, MessageButton } = require("discord.js");
const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Displays the status of the current queue
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
  let guild = data.guild;
  let queue = data.queue;
  let message = data.message;

  try { guild.activeCollectors.queueCollector.stop() } catch (e) { }
  guild.embedManager.delete(guild.activeEmbeds.queueEmbed);
  let currentPage = 0;

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('backPage')
        .setEmoji('◀️')
        .setLabel("prev page")
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('nextPage')
        .setEmoji('▶️')
        .setLabel("next page")
        .setStyle('SECONDARY'),
    );

  const embeds = await generateQueueEmbed(queue.songs, queue.current);
  const filter = i => i.customId === 'nextPage' || i.customId === 'backPage';

  let queueEmbed = await guild.embedManager.send({
    embeds: [embeds[currentPage]],
    components: [row]
  }, { replyTo: message, embedTimeout: 'none' });
  guild.activeEmbeds.queueEmbed = queueEmbed;

  let collector = message.channel.createMessageComponentCollector({ filter, time: 120000 });
  guild.activeCollectors.queueCollector = collector;

  collector.on('collect', async item => {
    if (item.customId === 'nextPage') {
      if (currentPage < embeds.length - 1) {
        currentPage++;
        await item.update({
          embeds: [embeds[currentPage]]
        });
      } else { item.deferUpdate(); }
    } else if (item.customId === 'backPage') {
      if (currentPage !== 0) {
        --currentPage;
        await item.update({ embeds: [embeds[currentPage]] });
      }
      else { item.deferUpdate(); }
    }
  });

  collector.on('end', async i => {
    guild.embedManager.edit(queueEmbed, {
      embeds: [embeds[currentPage]],
      components: []
    })
  })

  async function generateQueueEmbed(songs, current) {
    let embeds = [];
    let k = 10;
    if (songs.length == 0 && current !== null) embeds.push(embedGenerator.run('music.queue.info_02', { thumbnail: current.thumbnail.url, add: { description: `** - [${current.title}](${current.url})**\n\nEmpty!` } }))
    else if (songs.length > 0) {
      for (let index = 0; index < songs.length; index += 10) {
        const slicedSongs = songs.slice(index, k);
        let j = index;
        k += 10;
        const songList = slicedSongs.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");
        if (current) embeds.push(embedGenerator.run('music.queue.info_02', { thumbnail: current.thumbnail.url, add: { description: `** - [${current.title}](${current.url})**\n\n${songList}` } }))
        else embeds.push(embedGenerator.run('music.queue.info_05', { add: { description: `\n\n${songList}` } }))
      }
    }
    else embeds.push(embedGenerator.run('music.queue.info_03'));
    return embeds;
  }

  return { activeEmbeds: { queueEmbed: queueEmbed }, activeCollectors: { queueCollector: collector }, result: true }
}


const data = new CommandBuilder()
data.setName('queue')
data.setDescription('Displays the status of the current queue')
data.setMiddleware([]);
data.setCategory('music')
module.exports.data = data;