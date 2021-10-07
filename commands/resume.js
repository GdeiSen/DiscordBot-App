const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
const embedGenerator = require("../include/embedGenerator");
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
      return queue.textChannel.send({content: `${message.author} ${embedGenerator.run('direct.music.resume.info_01')}`}).catch(console.error);
    }

    return message.reply({content: `${embedGenerator.run('direct.music.resume.info_02')}`}).catch(console.error);
  };
module.exports.config = {
  name: "resume",
  description: "Continues playing the track",
  usage: "~resume",
  accessableby: "Members",
  aliases: ['res'],
  category: "music"
}
