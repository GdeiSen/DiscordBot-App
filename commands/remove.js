const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
module.exports.run = (bot,message, args) => {
  
  var embed1 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Ничего не воспроизводится**')
  .setColor('RED')

  var embed2 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription(`**недостаточно треков в очереди**`)
  .setColor('RED')
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(embed1).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.reply(embed2).catch(console.error);
    if (!args.length) return message.reply(`Использование: ${message.client.prefix}remove <номер>`);
    if (isNaN(args[0])) return message.reply(`Использование: ${message.client.prefix}remove <номер>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ убрал **${song[0].title}** из очереди`);
  };
  module.exports.config = {
    name: "remove",
    description: "удаляет трек из очереди",
    usage: "~remove args",
    accessableby: "Members",
    aliases: ['c', 'purge']
  }