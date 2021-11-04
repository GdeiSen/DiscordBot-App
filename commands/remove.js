const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
const embedGenerator = require("../include/utils/embedGenerator")
module.exports.run = (bot,message, args) => {
  
  let embed1 = embedGenerator.run('warnings.error_01');
  let embed2 = embedGenerator.run('music.remove.error_01');

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send({embeds: [embed1]}).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.reply(embed2).catch(console.error);
    if (!args.length) return message.reply({content: `${embedGenerator.run('direct.warnings.info_01')} ${message.client.prefix} ${embedGenerator.run('direct.warnings.info_02')}`});
    if (isNaN(args[0])) return message.reply({content: `${embedGenerator.run('direct.warnings.info_01')} ${message.client.prefix} ${embedGenerator.run('direct.warnings.info_02')}`});

    const song = queue.songs.splice(args - 1, 1);
    queue.textChannel.send({content: `${message.author} ${embedGenerator.run('direct.warnings.info_03')} **${song[0].title}** ${embedGenerator.run('direct.warnings.info_04')}`});
  };
  module.exports.config = {
    name: "remove",
    description: "deletes a track from the queue",
    usage: "~remove args",
    accessableby: "Members",
    aliases: [],
    category: "music"
  }