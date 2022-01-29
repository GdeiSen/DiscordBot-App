const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
  let seconds = Math.floor(message.client.uptime / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  let embed = new Discord.MessageEmbed()
    .setTitle('Bot LifeTime Function')
    .setDescription(`⏰ **Last Reboot:** Time: \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\``)
    .setColor('BLACK')
  message.channel.send({ embeds: [embed] })
}

module.exports.config = {
  name: "time",
  description: "displays the current time and date of the bot",
  usage: "~time",
  accessableby: "Members",
  aliases: ['uptime'],
  category: "admin",
  accesTest: "none"
}