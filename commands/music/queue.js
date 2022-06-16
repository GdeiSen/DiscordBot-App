module.exports.run = async (client, message, args) => {
  const queue = message.client.queue.get(message.guild.id);
  let params = client.guildParams.get(message.guild.id);
  queue.embedManager.sendQueueEmbed(message.channel, queue, { embedTimeout: params.embedTimeout });
}

module.exports.config = {
  name: "queue",
  usage: "~queue",
  description: "Displays the status of the current queue",
  accessableby: "Members",
  aliases: ['q', 'qu', 'que'],
  category: "music",
  accesTest: "music-command"
}