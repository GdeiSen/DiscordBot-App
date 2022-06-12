module.exports.run = async (client, message, args) => {
  let queue = await message.client.queue.get(message.guild.id);
  if (!args) {
    if (queue.config.loop == false) {
      queue.embedManager.sendQueueLoopEmbed(message.channel, { state: false, embedTimeout: queue.config.embedTimeout })
    }
    else {
      queue.embedManager.sendQueueLoopEmbed(message.channel, { state: true, embedTimeout: queue.config.embedTimeout })
    }
  }
  else if (args == 'off' || args == 'false') {
    queue.playerManager.queueLoop(false);
    queue.embedManager.sendQueueLoopEmbed(message.channel, { state: false, embedTimeout: queue.config.embedTimeout })
  }
  else if (args == 'on' || args == 'true') {
    queue.playerManager.queueLoop(true);
    queue.embedManager.sendQueueLoopEmbed(message.channel, { state: true, embedTimeout: queue.config.embedTimeout })
  }
  else {
    queue.embedManager.sendQueueLoopEmbed(message.channel, { warning: 'incorrect_args', embedTimeout: queue.config.embedTimeout })
  }
};

module.exports.config = {
  name: "queueLoop",
  cooldown: 3,
  aliases: ["ql"],
  description: "Option to enable queue repetition",
  category: "music",
  accesTest: "music-command",
};
