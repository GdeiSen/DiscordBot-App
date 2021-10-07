const { MessageEmbed } = require("discord.js");
const embedGenerator = require("../include/embedGenerator");

module.exports.run = async(bot,message,args)=> {

    let embed1 = await embedGenerator.run('warnings.error_03');
    let embed4 = await embedGenerator.run('music.play.error_04');
    
    const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
      return message.reply({embeds: [embed4]});

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send({embeds: [embed1]});

    let currentPage = 0;
    const embeds = await generateQueueEmbed(message, queue.songs);
    const queueEmbed = await message.channel.send({content:`**page - ${currentPage + 1}/${embeds.length}**`,
      embeds: [embeds[currentPage]]}
    );
      
    try {
      await queueEmbed.react("⬅️");
      await queueEmbed.react("⏹");
      await queueEmbed.react("➡️");
    } catch (error) {
      console.error(error);
      message.channel.send({content: `${error.message}`}).catch(console.error);
    }

    const filter = (reaction, user) =>
      ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name);
    const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

    collector.on("collect", async (reaction, user) => {
      try {
        if (reaction.emoji.name === "➡️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit(`**страница - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          }
        } else if (reaction.emoji.name === "⬅️") {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit(`**страница - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          }
        } else {
          collector.stop();
          reaction.message.reactions.removeAll();
        }
        await reaction.users.remove(message.author.id);
      } catch (error) {
        console.error(error);
        return message.channel.send({content:`error.message`}).catch(console.error);
      }
    });
  }
;

async function generateQueueEmbed(message, queue) {
  let embeds = [];
  let k = 10;

  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;

    const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");
    let embed = await embedGenerator.run('music.queue.info_02');
    await embed
      .setThumbnail(queue[0].thumbnails)
      .setDescription(`**${embed.description} - [${queue[0].title}](${queue[0].url})**\n\n${info}`)
      .setTimestamp();
    embeds.push({embeds: [embed]});
  }
  return embeds;
}

module.exports.config = {
  name: "queue",
  usage: "~queue",
  description: "Displays the status of the current queue",
  accessableby: "Members",
  aliases: ['q'],
  category: "music"
}