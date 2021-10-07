const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const embedGenerator = require("../include/embedGenerator")
module.exports.run = async(bot,message,args)=>{
    const queue = message.client.queue.get(message.guild.id);
  
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;
    let nowPlaying = await embedGenerator.run('music.nowPlaying.info_01');
    nowPlaying
      .setDescription(`${song.title}\n${song.url}`)
      .setAuthor(message.client.user.username);

    if (song.duration > 0) {
      nowPlaying.addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        true
      );
      nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
    }
    return message.channel.send(nowPlaying);
  };
  module.exports.config = {
    name: "nowplaying",
    description: "displays the current playback",
    usage: "~nowplaying",
    accessableby: "Members",
    aliases: ['now', 'n', 'np'],
    category: "music"
}