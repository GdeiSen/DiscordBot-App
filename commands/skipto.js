const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
module.exports.run = (bot, message, args) => {

  var embed1 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Ничего не воспроизводится**')
  .setColor('RED')

  var embed2 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription(`***здесь только ${queue.songs.length} треков в очереди**`)
  .setColor('RED')

    if (!args.length || isNaN(args[0]))
      return message
        .reply(`Использование: ${message.client.prefix}${module.exports.name} <Queue Number>`)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(embed1).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.reply(embed2).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ пропустил на ${args[0] - 1} треков`).catch(console.error);
  };
  module.exports.config = {
    name: "skipto",
    description: "пропускает трек на определённый",
    usage: "~skipto args",
    accessableby: "Members",
    aliases: ['c', 'purge']
  }
