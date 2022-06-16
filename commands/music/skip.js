module.exports.run = async (client, message, args) => {
  let queue = client.queue.get(message.guild.id);
  let params = client.guildParams.get(message.guild.id);
  queue.queueManager.skip();
  queue.embedManager.sendSkipEmbed(message.channel, { embedTimeout: params.embedTimeout })
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

