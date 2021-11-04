const { MessageEmbed } = require("discord.js");
const embedGenerator = require("../include/utils/embedGenerator")
const { MessageActionRow, MessageButton } = require('discord.js');
module.exports.run = async(bot,message,args)=> {

    let embed1 = await embedGenerator.run('warnings.error_03');
    let embed4 = await embedGenerator.run('music.play.error_04');
    
    const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
      return message.reply({embeds: [embed4]});


    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send({embeds: [embed1]});
    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);
    let currentPage = 0;
    const embeds = await generateQueueEmbed(message, queue.songs, queue.current);
    let embed = embeds[currentPage];
    console.log(embeds);
    setTimeout(async() => {
      message.channel.send({content: 'Queue', embeds: [embed], components: [row] });
    }, 3000);


  //   try {
  //     await queueEmbed.react("⬅️");
  //     await queueEmbed.react("⏹");
  //     await queueEmbed.react("➡️");
  //   } catch (error) {
  //     console.error(error);
  //     message.channel.send({content: `${error.message}`}).catch(console.error);
  //   }

  //   const filter = (reaction, user) =>
  //     ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name);
  //   const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

  //   collector.on("collect", async (reaction, user) => {
  //     try {
  //       if (reaction.emoji.name === "➡️") {
  //         if (currentPage < embeds.length - 1) {
  //           currentPage++;
  //           queueEmbed.edit(`**страница - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
  //         }
  //       } else if (reaction.emoji.name === "⬅️") {
  //         if (currentPage !== 0) {
  //           --currentPage;
  //           queueEmbed.edit(`**страница - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
  //         }
  //       } else {
  //         collector.stop();
  //         reaction.message.reactions.removeAll();
  //       }
  //       await reaction.users.remove(message.author.id);
  //     } catch (error) {
  //       console.error(error);
  //       return message.channel.send({content:`error.message`}).catch(console.error);
  //     }
  //   });
  // }
}

async function generateQueueEmbed(message, queue, current1) {
  let embeds = [];
  let k = 10;
  let currentSong = current1;
  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;
    const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");
    let embed = new MessageEmbed;
    embed
      .setTitle('Title')
      .setThumbnail(queue[0].thumbnails)
      .setDescription(`**Now Playing - [${currentSong.title}](${currentSong.url})**\n\n${info}`)
      .setTimestamp()
      .setColor('BLACK')
      console.log(embed)
    embeds.push(embed);
  }
  console.log(embeds);
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