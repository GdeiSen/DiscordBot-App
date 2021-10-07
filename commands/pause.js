const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
const embedGenerator = require("../include/embedGenerator")
text = require("../text_packs/en.json")
module.exports.run = async(bot, message, args)=>{
   {
    let embed1 = await embedGenerator.run('warnings.error_03');
    let queue = client.player.getQueue(message.guild.id);
    if (!queue) return message.reply({embeds: [embed1]}).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    queue.pause();
    queue.textChannel.send({content: `${message.author} ${text.music.pause.info_01}`}).catch(console.error);
  }
}
module.exports.config = {
  name: "pause",
  description: "Pauses the playback",
  usage: "~pause",
  accessableby: "Members",
  aliases: ['p', 'pau'],
  category: "music"
}

