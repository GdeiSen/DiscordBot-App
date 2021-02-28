const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
module.exports.run = (bot, message, args) => {

  var embed1 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Ничего не воспроизводится**')
  .setColor('RED')

  var embed2 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Для начала нужно быть в голосовом канале**')
  .setColor('RED')

  var embed3 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Введите параметр громкости**')
  .setColor('RED')

  var embed4 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Введите параметр громкости от 0 до 100**')
  .setColor('RED')
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(embed1).catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply(embed2).catch(console.error);

    if (!args) return message.reply(`🔊 Громкость: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args)) return message.reply(`🔊 Громкость: **${queue.volume}%**`).catch(console.error);
    if (Number(args) > 100 || Number(args) < 0 )
      return message.reply(embed4).catch(console.error);

    queue.volume = args;
    queue.connection.dispatcher.setVolumeLogarithmic(args / 100);

    return queue.textChannel.send(`Громкость выставлена на: **${args}%**`).catch(console.error);
  };
  module.exports.config = {
    name: "volume",
    description: "Выставляет значение громкости",
    usage: "~volume args",
    accessableby: "Members",
    aliases: ['vol']
  }