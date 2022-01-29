const embedGenerator = require("../../include/utils/embedGenerator");

module.exports.run = async (client, message, args) => {
  let queue = client.queue.get(message.guild.id);
  queue.playerMaster.stop();
  let embed = embedGenerator.run('music.stop.info_01');
  embed.setDescription(`${message.author.username} ${embed.description}`);
  message.channel.send({ embeds: [embed] });
};

module.exports.config = {
  name: "stop",
  description: "Stops playback",
  usage: "~stop",
  accessableby: "Members",
  aliases: ["stp"],
  category: "music",
  accesTest: "music-command"
};
