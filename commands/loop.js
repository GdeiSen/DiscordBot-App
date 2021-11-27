const embedGenerator = require("../include/utils/embedGenerator");
module.exports.run = async (client, message, args) => {
  let queue = await message.client.queue.get(message.guild.id);
  if(!args){
    if(queue.current.loop == false){
      let embed4 = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
      message.channel.send(embed4);
    }
    else{
      let embed5 = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
      message.channel.send(embed5);
    }
  }
  else if(args == 'off'){
    queue.playerMaster.songLoop(false);
    let embed2 = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
    message.channel.send(embed2);
  }
  else if(args == 'on'){
    queue.playerMaster.songLoop(true);
    let embed3 = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
    message.channel.send(embed3);
  }
  else {
    let embed1 = embedGenerator.run("warnings.error_04");
    embed1.setDescription(`${embed1.description} loop **on**/**off**`);
    message.channel.send({ embeds: [embed1] });
  }
};

module.exports.config = {
  name: "loop",
  cooldown: 3,
  aliases: ["l"],
  description: "Option to enable track repetition",
  category: "music",
  accesTest: "music-command"
};
