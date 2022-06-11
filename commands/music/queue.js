module.exports.run = async (client, message, args) => {
  const queue = message.client.queue.get(message.guild.id);
  queue.embedManager.sendQueueEmbed(message.channel, queue);
}

module.exports.config = {
  name: "queue",
  usage: "~queue",
  description: "Displays the status of the current queue",
  accessableby: "Members",
  aliases: ['q','qu','que'],
  category: "music",
  accesTest: "music-command"
}