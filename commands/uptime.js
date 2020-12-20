
const Discord = require("discord.js")
const botconfig = require("../config.json");

module.exports.run = async (bot, message, args) => {
  let seconds = Math.floor(message.client.uptime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    let embed = new Discord.MessageEmbed()
    .setTitle('текущее внутреннее время бота')
    .setDescription(`время: \`${days} дни,${hours} часы, ${minutes} минуты, ${seconds} секунды\``)
    .setColor('GREEN')
    message.channel.send(embed)
}

module.exports.config = {
    name: "time",
    description: "отображает текущее время и дату бота",
    usage: "~time",
    accessableby: "Members",
    aliases: ['c', 'purge']
}