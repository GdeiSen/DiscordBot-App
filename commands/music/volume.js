module.exports.run = (bot, message, args) => {
  let queue = message.client.queue.get(message.guild.id);
  if (queue.playerManager.setVolume(args) == false) { queue.embedManager.sendVolumeEmbed(message.channel, { warning: 'incorrect_args' }) }
  else queue.embedManager.sendVolumeEmbed(message.channel, { state: args, embedTimeout: queue.config.embedTimeout });
};

module.exports.config = {
  name: "volume",
  description: "Sets the volume value",
  usage: "~volume args",
  accessableby: "Members",
  aliases: ['vol', 'vl'],
  category: "music",
  accesTest: "music-command"
}