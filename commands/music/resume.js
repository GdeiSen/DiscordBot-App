module.exports.run = async (client, message, args) => {
  let queue = client.queue.get(message.guild.id);
  queue.embedManager.sendResumeEmbed(message.channel, { queueStatus: queue.status });
  queue.playerManager.resume()
};

module.exports.config = {
  name: "resume",
  description: "Continues playing the track",
  usage: "~resume",
  accessableby: "Members",
  aliases: ["res"],
  category: "music",
  accesTest: "music-command",
};

