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

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ продолжил воспроизведение!`).catch(console.error);
    }

    return message.reply("воспроизведение продолжено").catch(console.error);
  };
module.exports.config = {
  name: "resume",
  description: "продолжает воспроизведение трека",
  usage: "~resume",
  accessableby: "Members",
  aliases: ['c', 'purge']
}
