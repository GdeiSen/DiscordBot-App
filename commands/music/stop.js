module.exports.run = async (client, message, args) => {
  let queue = client.queue.get(message.guild.id);
  queue.playerManager.stop();
  queue.embedManager.sendStopEmbed(message.channel);
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
