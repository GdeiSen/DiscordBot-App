const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

module.exports.run = (bot,message,args)=>{
    const queue = message.client.queue.get(message.guild.id);

    var embed1 = new MessageEmbed()
    .setTitle('ошибка')
    .setDescription('**Ничего не воспроизводится**')
    .setColor('RED')

    if (!queue) return message.reply(embed1).catch(console.error);

    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle("сейчас играет")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor('GREEN')
      .setAuthor(message.client.user.username);

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

    return message.channel.send(nowPlaying);
  };
  module.exports.config = {
    name: "nowplaying",
    description: "отображает текущее воспроизведение",
    usage: "~nowplaying",
    accessableby: "Members",
    aliases: ['now', 'n', 'np']
}