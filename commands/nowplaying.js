
const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const embedGenerator = require("../include/embedGenerator")
module.exports.run = async(client,message,args)=>{
    let queue = await client.player.getQueue(message.guild.id);
    let embed1 = await embedGenerator.run('warnings.error_03');
  
    if (!queue) return message.reply({embeds: [embed1]}).catch(console.error);

    const song = queue.songs[0];
    const seek = (queue.connection.streamTime - queue.connection.pausedTime) / 1000;
    const left = song.duration - seek;
    console.log(seek);
    let nowPlaying = await embedGenerator.run('music.nowPlaying.info_01');
    nowPlaying
      .setDescription(`${song.name}\n${song.url}`)
      .setAuthor(message.client.user.username)
      .setThumbnail(song.thumbnail)
    if (song.duration > 0) {
      nowPlaying.addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );
      nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
    }

    return message.channel.send({embeds: [nowPlaying]});
  };
  module.exports.config = {
    name: "nowplaying",
    description: "displays the current playback",
    usage: "~nowplaying",
    accessableby: "Members",
    aliases: ['now', 'n', 'np'],
    category: "music"
}