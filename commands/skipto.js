const embedGenerator = require("../include/utils/embedGenerator");
module.exports.run = async (client, message, args) => {
  const queue = message.client.queue.get(message.guild.id);
  let embed2 = embedGenerator.run("music.skipto.error_01");
  if (queue.playerMaster.skipTo(args) == false)
    return message.reply({ embeds: [embed2] }).catch(console.error);
  else {
    let embed = embedGenerator.run("music.skip.info_01");
    embed.setDescription(`${message.author.username} ${embed.description}`);
    message.channel.send({ embeds: [embed] });
  }
  return 0;
};
module.exports.config = {
  name: "skipto",
  description: "Skips a track for a certain period",
  usage: "~skipto args",
  accessableby: "Members",
  aliases: ["skpt"],
  category: "music",
  accesTest: "music-command",
};
