module.exports.run = async (client, message, args) => {
  let queue = client.queue.get(message.guild.id);
  queue.playerManager.skip();
  queue.embedManager.sendSkipEmbed(message.channel)
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

