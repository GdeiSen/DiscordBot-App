const Discord = require("discord.js")
const botconfig = require("../config.json");

module.exports.run = async (bot, message, args) => {
    let embed1 = new Discord.MessageEmbed()
    .setTitle('хэй хэй погоди я еще не готов')
    .setDescription('В процессе разработки!')
    .setColor('RED')
    message.channel.send(embed1)
}

module.exports.config = {
    name: "help",
    description: "giving commands info",
    usage: "~help",
    accessableby: "Members",
    aliases: ['c', 'purge']
}