const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
const embedGenerator = require("../include/utils/embedGenerator")
module.exports.run = (bot, message, args) =>{
    let embed1 = embedGenerator.run('warnings.error_03');

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send({embeds:[embed1]}).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send({content: `${embedGenerator.run('direct.music.shuffle.info_01')}`}).catch(console.error);
  };
  module.exports.config = {
    name: "shuffle",
    description: "Shuffles the queue",
    usage: "~shuffle",
    accessableby: "Members",
    aliases: ['sh'],
    category: "music"
  }
