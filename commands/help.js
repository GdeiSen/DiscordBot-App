const { MessageEmbed } = require("discord.js");
const text = require("../text_packs/en.json");

module.exports.run = (client,message,args) =>{
    let commands = message.client.commands;
    message.client.categories.forEach(category => {
      let embed = new MessageEmbed()
      .setTitle(`${message.client.user.username}` + text.info.help[category].embedTitle)
      .setDescription(text.info.help[category].embedDescription)
      .setColor(text.info.help[category].embedColor);

      commands.forEach(cmd =>{
        if(cmd.config.category == category){
          embed.addField(
          `**${message.client.prefix}${cmd.config.name}**`,
          `${cmd.config.description}`,
          true)}
      })
      message.channel.send({embeds: [embed]});
    })
    };
  module.exports.config = {
    name: "help",
    description: "Displays the description of the command",
    usage: "~help",
    accessableby: "Members",
    aliases: ['h', 'hlp'],
    category: "admin",
    accesTest: "none"
}
