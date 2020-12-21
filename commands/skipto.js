const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
module.exports.run = (bot, message, args) => {
const queue = message.client.queue.get(message.guild.id);
  var embed1 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Ничего не воспроизводится**')
  .setColor('RED')

  var embed2 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription(`**недостаточно треков в очереди.\nили вы превысили максимальное число для пропуска - 15**`)
  .setColor('RED')
  if (!queue) return message.channel.send(embed1).catch(console.error);
    if (!args.length || isNaN(args))
      return message
        .reply(`Использование: ${message.client.prefix}${module.exports.name} <Queue Number>`)
        .catch(console.error);

    
    if (!queue) return message.channel.send(embed1).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args > queue.songs.length)
      return message.reply(embed2).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ пропустил на ${args - 1} треков`).catch(console.error);
  };
  module.exports.config = {
    name: "skipto",
    description: "Пропускает трек на определённый",
    usage: "~skipto args",
    accessableby: "Members",
    aliases: ['skpt']
  }
