const { canModifyQueue } = require("../util/EvobotUtil");
const embedGenerator = require("../include/embedGenerator")
module.exports.run = (bot, message, args) => {


  let embed1 = embedGenerator.run("warnings.error_03");
  let embed2 = embedGenerator.run('music.play.error_02');
  let embed3 = embedGenerator.run('music.volume.error_01');
  let embed4 = embedGenerator.run('music.volume.error_02');

    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.channel.send({embeds:[embed1]}).catch(console.error);
    if (!canModifyQueue(message.member))
      return message.channel.send({embeds:[embed2]}).catch(console.error);

    if (!args) return message.channel.send({content:`${embedGenerator.run("direct.music.volume.info_01")} **${queue.volume}%**`}).catch(console.error);
    if (isNaN(args)) return message.channel.send({content:`${embedGenerator.run("direct.music.volume.info_01")} **${queue.volume}%**`}).catch(console.error);
    if (Number(args) > 100 || Number(args) < 0 )
      return message.channel.send({embeds:[embed4]}).catch(console.error);

    queue.volume = args;
    queue.connection.dispatcher.setVolumeLogarithmic(args / 100);

    return queue.textChannel.send({content:`${embedGenerator.run("direct.music.volume.info_02")} **${args}%**`}).catch(console.error);
  };
  module.exports.config = {
    name: "volume",
    description: "Sets the volume value",
    usage: "~volume args",
    accessableby: "Members",
    aliases: ['vol'],
    category: "music"
  }