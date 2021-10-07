const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
const embedGenerator = require("../include/embedGenerator")
module.exports.run = (bot, message, args) => {
  const queue = message.client.queue.get(message.guild.id);
  let embed1 = embedGenerator.run('warnings.error_03');
  let embed2 = embedGenerator.run('music.skipto.error_01');
  
  if (!queue) return message.channel.send({embeds:[embed1]}).catch(console.error);
  if (!args.length || isNaN(args))
    return message
      .reply(`Использование: ${message.client.prefix}${module.exports.name} <Queue Number>`)
      .catch(console.error);

  if (!queue) return message.channel.send({embeds:[embed1]}).catch(console.error);
  if (!canModifyQueue(message.member)) return;
  if (args > queue.songs.length) return message.reply({embeds:[embed2]}).catch(console.error);

  queue.playing = true;

  if (queue.loop) {
    for (let i = 0; i < args - 2; i++) {
      queue.songs.push(queue.songs.shift());
    }
  } else {
    queue.songs = queue.songs.slice(args - 2);
  }

  queue.connection.dispatcher.end();
  queue.textChannel.send(`${message.author} ${embedGenerator.run(direct.music.skipto.info_01)} ${args - 1} ${embedGenerator.run(direct.music.skipto.info_02)}`).catch(console.error);
};
module.exports.config = {
  name: "skipto",
  description: "Skips a track for a certain period",
  usage: "~skipto args",
  accessableby: "Members",
  aliases: ["skpt"],
  category: "music"
};
