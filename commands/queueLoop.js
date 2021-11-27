const embedGenerator = require("../include/utils/embedGenerator");
const { RepeatMode } = require("discord-music-player");
const { accesTester } = require("../include/utils/accesTester.js");
module.exports.run = async (client, message, args) => {
  let queue = await message.client.queue.get(message.guild.id);
  if(!args){
    if(queue.config.loop == false){
      let embed4 = `${embedGenerator.run("direct.music.queueLoop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
      message.channel.send(embed4);
    }
    else{
      let embed5 = `${embedGenerator.run("direct.music.queueLoop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
      message.channel.send(embed5);
    }
  }
  else if(args == 'off'){
    queue.playerMaster.queueLoop(false);
    let embed2 = `${embedGenerator.run("direct.music.queueLoop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
    message.channel.send(embed2);
  }
  else if(args == 'on'){
    queue.playerMaster.queueLoop(true);
    let embed3 = `${embedGenerator.run("direct.music.queueLoop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
    message.channel.send(embed3);
  }
  else {
    let embed1 = embedGenerator.run("warnings.error_04");
    embed1.setDescription(`${embed1.description} queueLoop **on**/**off**`);
    message.channel.send({ embeds: [embed1] });
  }
};

module.exports.config = {
  name: "queueLoop",
  cooldown: 3,
  aliases: ["ql"],
  description: "Option to enable queue repetition",
  category: "music",
  accesTest: "music-command",
};
