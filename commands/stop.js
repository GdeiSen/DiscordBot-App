const embedGenerator = require("../include/embedGenerator");
const { accesTester } = require("../include/accesTester.js");
module.exports.run = async (client, message, args) => {
  const tester = new accesTester(message, args);
  await tester.testAdioWArgsAcces().then(
    async (result) => {
      let guildQueue = await client.player.getQueue(message.guild.id);
      guildQueue.stop();
      message.channel
        .send(
          `${message.author} ${embedGenerator.run('direct.music.stop.info_01')}`
        )
        .catch(console.error);
    },
    async (error) => {
      await message.channel.send({ embeds: [error] });
      return 0;
    }
  );
};
module.exports.config = {
  name: "stop",
  description: "Stops playback",
  usage: "~stop",
  accessableby: "Members",
  aliases: ["stp"],
  category: "music",
};
