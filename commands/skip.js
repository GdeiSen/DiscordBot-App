const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
const embedGenerator = require("../include/embedGenerator");
module.exports.run = (bot, message, args) => {
  let embed1 = embedGenerator.run("warnings.error_03");
  const queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message
      .send({
        embeds: [embed1]
      })
      .catch(console.error);
  if (!canModifyQueue(message.member)) return;

  queue.playing = true;
  queue.connection.dispatcher.end();
  queue.textChannel
    .send(`${message.author} ${embedGenerator.run("direct.music.skip.info_01")}`)
    .catch(console.error);
};
module.exports.config = {
  name: "skip",
  description: "Skips a track",
  usage: "~skip",
  accessableby: "Members",
  aliases: ["sk"],
  category: "music"
};
