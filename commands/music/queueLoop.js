module.exports.run = async (client, message, args) => {
  let queue = await message.client.queue.get(message.guild.id);
  let params = client.guildParams.get(message.guild.id);
  if (!args) {
    if (queue.loop == false) {
      queue.embedManager.sendQueueLoopEmbed(message.channel, { state: false, embedTimeout: params.embedTimeout })
    }
    else {
      queue.embedManager.sendQueueLoopEmbed(message.channel, { state: true, embedTimeout: params.embedTimeout })
    }
  }
  else if (args == 'off' || args == 'false') {
    queue.playerManager.queueLoop(false);
    queue.embedManager.sendQueueLoopEmbed(message.channel, { state: false, embedTimeout: params.embedTimeout })
  }
  else if (args == 'on' || args == 'true') {
    queue.playerManager.queueLoop(true);
    queue.embedManager.sendQueueLoopEmbed(message.channel, { state: true, embedTimeout: params.embedTimeout })
  }
  else {
    queue.embedManager.sendQueueLoopEmbed(message.channel, { warning: 'incorrect_args', embedTimeout: params.embedTimeout })
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
