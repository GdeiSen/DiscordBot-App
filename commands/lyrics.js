const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.channel.send('ничего не играет').catch(console.error);

    let lyrics = null;
    const title = queue.songs[0].title;
    console.log(args);
    if (args != '~lyr' && args) {lyrics = await lyricsFinder(args);
        if (!lyrics) lyrics = ("Текст не был найден!");
    }
    else{
    try {
      lyrics = await lyricsFinder(queue.songs[0].title);
      if (!lyrics) lyrics = ("Текст не был найден!\n Попробуйте использовать ручной поиск > ~lyrics [args]");
    } catch (error) {
      lyrics = ("lyrics.lyricsNotFound");
    }
}
    let lyricsEmbed = new MessageEmbed()
      .setTitle('Текст песни')
      .setDescription(lyrics)
      .setColor("GREEN")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }

module.exports.config = {
    name: "lyrics",
    description: "ввыводит текст песни",
    usage: "~lyrics",
    accessableby: "Members",
    aliases: ['lyr']
}