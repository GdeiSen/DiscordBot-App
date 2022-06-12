module.exports.run = async (bot, message, args) => {
  const queue = message.client.queue.get(message.guild.id);
  queue.playerManager.shuffle();
  queue.embedManager.sendShuffleEmbed(message.channel, {embedTimeout: queue.config.embedTimeout});
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
