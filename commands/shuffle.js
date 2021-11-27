const embedGenerator = require("../include/utils/embedGenerator")
module.exports.run = async (bot, message, args) =>{
    const queue = message.client.queue.get(message.guild.id);
    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    let embed = await embedGenerator.run('music.shuffle.info_01');
    embed.setDescription(`${message.author.username} ${embed.description}`);
    message.channel.send({embeds: [embed]}).catch(console.error);
  };
  module.exports.config = {
    name: "shuffle",
    description: "Shuffles the queue",
    usage: "~shuffle",
    accessableby: "Members",
    aliases: ['sh'],
    category: "music",
    accesTest: "music-command"
  }
