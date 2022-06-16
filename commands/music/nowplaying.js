module.exports.run = async (client, message) => {
  let queue = await client.queue.get(message.guild.id);
  let params = client.guildParams.get(message.guild.id);
  queue.embedManager.sendNowPlayingEmbed(queue, message.channel, { embedTimeout: params.embedTimeout });
};

module.exports.config = {
  name: "nowplaying",
  description: "displays the current playback",
  usage: "~nowplaying",
  accessableby: "Members",
  aliases: ['now', 'n', 'np', 'playing'],
  category: "music",
  accesTest: "music-command"
}