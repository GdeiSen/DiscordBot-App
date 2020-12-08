const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js")
module.exports.run = (bot,message,args) =>{
  var embed1 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('**Ничего не воспроизводится**')
    .setColor('RED')

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(embed1).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel.send(`Повторение трека ${queue.loop ? "**включено**" : "**выключено**"}`).catch(console.error);
  }
;


module.exports.config = {
  name: "loop",
  cooldown: 3,
  aliases: ["p"],
  description: "Опция включения повторения трека",
}