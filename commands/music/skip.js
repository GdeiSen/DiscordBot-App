const embedGenerator = require("../../include/utils/embedGenerator")

module.exports.run = async(client, message, args) => {
    let queue = client.queue.get(message.guild.id);
    queue.status = 'pending';
    queue.player.stop();
    let embed = embedGenerator.run('music.skip.info_01');
    embed.setDescription(`${message.author.username} ${embed.description}`);
    message.channel.send({embeds:[embed]})
};

module.exports.config = {
  name: "skip",
  description: "Skips a track",
  usage: "~skip",
  accessableby: "Members",
  aliases: ["sk"],
  category: "music",
  accesTest: "music-command"
};

