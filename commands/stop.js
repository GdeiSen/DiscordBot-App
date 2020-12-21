const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
module.exports.run = (bot, message, args) => {
  var embed1 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Ничего не воспроизводится**')
  .setColor('RED')
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(embed1).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ остановил музыку!`).catch(console.error);
  };
  module.exports.config = {
    name: "stop",
    description: "Останавливает воспроизведение",
    usage: "~stop",
    accessableby: "Members",
    aliases: ['stp']
  }
