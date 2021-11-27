const embedGenerator = require("../include/utils/embedGenerator");
const { accesTester } = require("../include/utils/accesTester.js");
module.exports.run = async (client, message, args) => {
  let queue = client.queue.get(message.guild.id);
  if (queue.playerMaster.resume() == false) {
    message.channel
      .send({
        content: `${message.author} ${embedGenerator.run(
          "direct.music.resume.info_02"
        )}`,
      })
      .catch(console.error);
  } else {
    let embed = embedGenerator.run("music.resume.info_01");
    embed.setDescription(`${message.author.username} ${embed.description}`);
    message.channel.send({ embeds: [embed] });
  }
};

module.exports.config = {
  name: "resume",
  description: "Continues playing the track",
  usage: "~resume",
  accessableby: "Members",
  aliases: ["res"],
  category: "music",
  accesTest: "music-command",
};
