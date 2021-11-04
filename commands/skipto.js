const embedGenerator = require("../include/utils/embedGenerator");
const { queueMaster } = require("../include/music_engine/queueMaster");
const { accesTester } = require("../include/utils/accesTester.js");
const skip = require('./skip');
module.exports.run = async (client, message, args) => {
  const tester = new accesTester(message, args);
  await tester.testPlayCommandAudioAccesPack().then(
    async (result) => {
        const queue = message.client.queue.get(message.guild.id);
        let embed2 = embedGenerator.run('music.skipto.error_01');
        if (args > queue.songs.length) return message.reply({embeds: [embed2]}).catch(console.error);
        else if (args == 1 || args == 0) {skip.run(client, message, args);return 0;}
        if (queue.config.loop == true) {
          for (let i = 0; i < args - 2; i++) {
            queue.songs.push(queue.songs.shift());
          }
        } else {queue.songs = queue.songs.slice(args - 2);}
        QueueMaster = new queueMaster(client, message);
        queue.status = 'pending';
        queue.player.stop();
        let embed = embedGenerator.run('music.skip.info_01');
        embed.setDescription(`${message.author.username} ${embed.description}`);
        message.channel.send({
          embeds: [embed]
        });
      },
      (error) => {
        message.channel.send({
          embeds: [error]
        });
        return 0
      });
};
module.exports.config = {
  name: "skipto",
  description: "Skips a track for a certain period",
  usage: "~skipto args",
  accessableby: "Members",
  aliases: ["skpt"],
  category: "music"
};
