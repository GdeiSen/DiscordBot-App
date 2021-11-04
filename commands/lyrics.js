const Discord = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const embedGenerator = require("../include/utils/embedGenerator")
module.exports.run = async (client, message, args) => {
  try {
    let queue = client.queue.get(message.guild.id);
    let name;
    let embed1 = await embedGenerator.run("music.lyrics.error_01");
    let embed2 = await embedGenerator.run("music.lyrics.error_02");
    let embed3 = await embedGenerator.run("music.lyrics.error_03");
    let embed4 = await embedGenerator.run("music.lyrics.info_01");
    let lyrics = null;
    if (!queue && !args) {
      message.channel.send({ embeds: [embed3] });
      return 0;
    } else if (!queue && args) {
      try {
        lyrics = await lyricsFinder(args);
        if (!lyrics) throw error;
        name = args;
      } catch (error) {
        message.channel.send({ embeds: [embed1] });
        return 0;
      }
    } else if (queue && !args) {
      try {
        const title = client.queue.songs[0].title;
        name = title;
        lyrics = await lyricsFinder(title);
        if (!lyrics) throw error;
      } catch (error) {
        message.channel.send({ embeds: [embed2] });
        return 0;
      }
    } else if (queue && args) {
      try {
        lyrics = await lyricsFinder(args);
        if (!lyrics) throw error;
        name = args;
      } catch (error) {
        message.channel.send({ embeds: [embed1] });
        return 0;
      }
    }

    embed4.setDescription(`${embed4.description} **${name}**\n  ${lyrics}`);
    if (embed4.description.length >= 2048) embed4.description = `${embed4.description.substr(0, 2045)}...`;
    message.channel.send({ embeds: [embed4] }).catch(console.error);
  } catch (error) {
    console.log(error);
  }
};

module.exports.config = {
  name: "lyrics",
  description: "displays the lyrics of the song",
  usage: "~lyrics",
  accessableby: "Members",
  aliases: ["lyr"],
  category: "music"
};
