module.exports.run = async (bot, message, args) => {
  let queue = message.client.queue.get(message.guild.id);
  let params = client.guildParams.get(message.guild.id);
  queue.queueManager.shuffle();
  queue.embedManager.sendShuffleEmbed(message.channel, {embedTimeout: params.embedTimeout});
};

module.exports.config = {
  name: "shuffle",
  description: "Shuffles the queue",
  usage: "~shuffle",
  accessableby: "Members",
  aliases: ['sh','random', 'rand'],
  category: "music",
  accesTest: "music-command"
}
