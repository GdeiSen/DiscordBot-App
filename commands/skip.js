const embedGenerator = require("../include/utils/embedGenerator")
const { queueMaster } = require("../include/music_engine/queueMaster");
const { accesTester } = require("../include/utils/accesTester.js");
module.exports.run = async(client, message, args) => {
  const tester = new accesTester(message, args);
    await tester.testPlayCommandAudioAccesPack().then(
      async (result) => {
        let queue = client.queue.get(message.guild.id);
        QueueMaster = new queueMaster(client, message);
        queue.status = 'pending';
        queue.player.stop();
        let embed = embedGenerator.run('music.skip.info_01');
        embed.setDescription(`${message.author.username} ${embed.description}`);
        message.channel.send({embeds:[embed]});
      },
      (error) => {message.channel.send({ embeds: [error] }); return 0});
};
module.exports.config = {
  name: "skip",
  description: "Skips a track",
  usage: "~skip",
  accessableby: "Members",
  aliases: ["sk"],
  category: "music"
};
