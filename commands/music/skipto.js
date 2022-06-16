module.exports.run = async (client, message, args) => {
  let queue = message.client.queue.get(message.guild.id);
  let params = client.guildParams.get(message.guild.id);
  if (queue.queueManager.skipTo(args).error) queue.embedManager.sendSkipToEmbed(message.channel, { warning: 'incorrect_args' })
  else queue.embedManager.sendSkipToEmbed(message.channel, { embedTimeout: params.embedTimeout })
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

