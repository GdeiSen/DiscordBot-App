module.exports.run = async (client, message, args) => {
  let queue = client.queue.get(message.guild.id);
  let params = client.guildParams.get(message.guild.id);
  queue.playerManager.stop();
  queue.embedManager.sendStopEmbed(message.channel, { embedTimeout: params.embedTimeout });
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
