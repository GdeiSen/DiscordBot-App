const embedGenerator = require("../include/utils/embedGenerator")
module.exports.run = (bot, message, args) => {
  let embed4 = embedGenerator.run('music.volume.error_02');
    const queue = message.client.queue.get(message.guild.id);
    if (!args) return message.channel.send({content:`${embedGenerator.run("direct.music.volume.info_01")} **${queue.config.volume}%**`}).catch(console.error);
    if (isNaN(args)) return message.channel.send({content:`${embedGenerator.run("direct.music.volume.info_01")} **${queue.config.volume}%**`}).catch(console.error);
    if (Number(args) > 100 || Number(args) < 0 ) return message.channel.send({embeds:[embed4]}).catch(console.error);
    queue.config.volume = args;
    queue.resource.volume.setVolume(args / 100);
    return message.channel.send({content:`${embedGenerator.run("direct.music.volume.info_02")} **${args}%**`}).catch(console.error);
  };
  module.exports.config = {
    name: "volume",
    description: "Sets the volume value",
    usage: "~volume args",
    accessableby: "Members",
    aliases: ['vol'],
    category: "music",
    accesTest: "music-command"
  }