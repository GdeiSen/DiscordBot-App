module.exports.run = async (client, message, args) => {
  let queue = client.queue.get(message.guild.id);
  let params = client.guildParams.get(message.guild.id);
  queue.embedManager.sendPausedEmbed(message.channel, { queueStatus: queue.status, embedTimeout: params.embedTimeout });
  queue.playerManager.pause();
};

module.exports.config = {
  name: "pause",
  description: "Pauses the playback",
  usage: "~pause",
  accessableby: "Members",
  aliases: ["pa", "pau"],
  category: "music",
  accesTest: "music-command",
};
