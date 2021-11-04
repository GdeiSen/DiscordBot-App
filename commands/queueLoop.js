const embedGenerator = require("../include/utils/embedGenerator")
const { RepeatMode } = require('discord-music-player');
const { accesTester } = require("../include/utils/accesTester.js");
module.exports.run = async (client, message, args) => {
  const tester = new accesTester(message, args);
  await tester.testAdioWArgsAcces().then(
    async (result) => {
      let guildQueue = await client.player.getQueue(message.guild.id);
      if(guildQueue.queueLoop == 0 || guildQueue.queueLoop == undefined){
        guildQueue.songloop = 0;
        guildQueue.queueLoop = 1;
        guildQueue.setRepeatMode(RepeatMode.QUEUE);
        message.channel
        .send(
          `${embedGenerator.run('direct.music.queueLoop.info_01')} ${embedGenerator.run('direct.music.loop.info_02')}`
        )
        .catch(console.error);
      }
      else{
        guildQueue.songloop = 0;
        guildQueue.queueLoop = 0;
        guildQueue.setRepeatMode(RepeatMode.DISABLED);
        message.channel
        .send(
          `${embedGenerator.run('direct.music.queueLoop.info_01')} ${embedGenerator.run('direct.music.loop.info_03')}`
        )
        .catch(console.error);
      }
    },
    (error) => {
      message.channel.send({ embeds: [error] });
      return 0;
    }
  );
};

module.exports.config = {
  name: "queueLoop",
  cooldown: 3,
  aliases: ["ql"],
  description: "Option to enable queue repetition",
  category: "music",
};
