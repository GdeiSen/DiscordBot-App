const embedGenerator = require("../include/utils/embedGenerator");
module.exports.run = async (client, message, args) => {
  let queue = client.queue.get(message.guild.id);
  if (queue.playerMaster.pause() == false) {
    message.channel
      .send({
        content: `${message.author} ${embedGenerator.run(
          "direct.music.pause.info_02"
        )}`,
      })
      .catch(console.error);
  } else {
    let embed = embedGenerator.run("music.pause.info_01");
    embed.setDescription(`${message.author.username} ${embed.description}`);
    message.channel.send({ embeds: [embed] });
  }
};
module.exports.config = {
  name: "pause",
  description: "Pauses the playback",
  usage: "~pause",
  accessableby: "Members",
  aliases: ["pa", "pau"],
  category: "music",
  accesTest: "music-command",
};
