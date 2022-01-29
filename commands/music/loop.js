const embedGenerator = require("../../include/utils/embedGenerator");

module.exports.run = async (client, message, args) => {
  let queue = await message.client.queue.get(message.guild.id);
  if(!args){
    if(queue.current.loop == false){
      let embed = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
      message.channel.send(embed);
    }
    else{
      let embed = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
      message.channel.send(embed);
    }
  }
  else if(args == 'off' || args == 'false'){
    queue.playerMaster.songLoop(false);
    let embed = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
    message.channel.send(embed);
  }
  else if(args == 'on'|| args == 'true'){
    queue.playerMaster.songLoop(true);
    let embed = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
    message.channel.send(embed);
  }
  else {
    let embed = embedGenerator.run("warnings.error_04");
    embed.setDescription(`${embed.description} loop **on**/**off**`);
    message.channel.send({ embeds: [embed] });
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
