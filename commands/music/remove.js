const embedGenerator = require("../../include/utils/embedGenerator")

module.exports.run = (bot, message, args) => {
  const queue = message.client.queue.get(message.guild.id);
  let embed2 = embedGenerator.run('music.remove.error_01');
  let embed1 = embedGenerator.run("warnings.error_04");
  if (args > queue.songs.length || args[0] == 0) return message.channel.send({ embeds: [embed2] }).catch(console.error);
  else if (!args || isNaN(args[0])) {
    embed1.setDescription(`${embed1.description} remove **track number**`);
    return message.channel.send({ embeds: [embed1] });
  }
  let song = queue.playerMaster.remove(args-1);
  message.channel.send({ content: `${message.author} ${embedGenerator.run('direct.music.remove.info_03')} **${song[0].title}** ${embedGenerator.run('direct.music.remove.info_04')}` });
};

module.exports.config = {
  name: "remove",
  description: "deletes a track from the queue",
  usage: "~remove args",
  accessableby: "Members",
  aliases: [],
  category: "music",
  accesTest: "music-command"
}