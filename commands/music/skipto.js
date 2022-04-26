module.exports.run = async (client, message, args) => {
  let queue = message.client.queue.get(message.guild.id);
  if (queue.playerManager.skipTo(args) == false) queue.embedManager.sendSkipToEmbed(message.channel, { warning: 'incorrect_args' })
  else queue.embedManager.sendSkipToEmbed(message.channel)
};

module.exports.config = {
  name: "skipto",
  description: "Skips a track for a certain period",
  usage: "~skipto args",
  accessableby: "Members",
  aliases: ["skpt"],
  category: "music",
  accesTest: "music-command",
};

