const { MessageEmbed } = require("discord.js");

module.exports.run = (client,message,args) =>{
    let commands = message.client.commands.array();
    let helpEmbed = new MessageEmbed()
      .setTitle(`${message.client.user.username} Help`)
      .setDescription("Полный список комманд")
      .setColor("#F8AA2A");

    message.client.commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.config.name}**`,
        `${cmd.config.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  };
  module.exports.config = {
    name: "help",
    description: "Выводит описание комманд",
    usage: "~help",
    accessableby: "Members",
    aliases: ['c', 'purge']
}
