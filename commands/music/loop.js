module.exports.run = async (client, message, args) => {
  let queue = await client.queue.get(message.guild.id);
  let params = await client.guildParams.get(message.guild.id);
  if (!args) {
    if (queue.current.loop == false) {
      queue.embedManager.sendSongLoopEmbed(message.channel, { state: false, embedTimeout: params.embedTimeout })
    }
    else {
      queue.embedManager.sendSongLoopEmbed(message.channel, { state: true, embedTimeout: params.embedTimeout })
    }
  }
  else if (args == 'off' || args == 'false') {
    queue.playerManager.songLoop(false);
    queue.embedManager.sendSongLoopEmbed(message.channel, { state: false, embedTimeout: params.embedTimeout })
  }
  else if (args == 'on' || args == 'true') {
    queue.playerManager.songLoop(true);
    queue.embedManager.sendSongLoopEmbed(message.channel, { state: true, embedTimeout: params.embedTimeout })
  }
  else {
    queue.embedManager.sendSongLoopEmbed(message.channel, { warning: 'incorrect_args', embedTimeout: params.embedTimeout })
  }
};

module.exports.config = {
  name: "loop",
  cooldown: 3,
  aliases: ["l"],
  description: "Option to enable track repetition",
  category: "music",
  accesTest: "music-command"
};
