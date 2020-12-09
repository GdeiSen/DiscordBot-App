const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
module.exports.run = (bot, message, args) =>{
  var embed1 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Ничего не воспроизводится**')
  .setColor('RED')
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(embed1).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send(`${message.author} 🔀 перемешал очередь`).catch(console.error);
  };
  module.exports.config = {
    name: "shuffle",
    description: "Перемешивает очередь",
    usage: "~shuffle",
    accessableby: "Members",
    aliases: ['c', 'purge']
  }
