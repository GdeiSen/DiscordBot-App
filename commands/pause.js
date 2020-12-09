const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
module.exports.run = (bot, message, args)=>{
   {
    var embed1 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('**Ничего не воспроизводится**')
    .setColor('RED')
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(embed1).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸ поставил на паузу`).catch(console.error);
    }
  }
}
module.exports.config = {
  name: "pause",
  description: "Ставит на паузу возпроизведение",
  usage: "~pause",
  accessableby: "Members",
  aliases: ['c', 'purge']
}

