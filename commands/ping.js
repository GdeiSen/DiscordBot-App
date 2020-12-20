const Discord = require("discord.js")
const botconfig = require("../config.json");

module.exports.run = async (bot, message, args) => {

    let embed = new Discord.MessageEmbed()
    .setTitle('пинг')
    .setDescription(`📈 средний пинг данного региона: ${Math.round(message.client.ws.ping)} ms`)
    .setColor('GREEN')
    message.channel.send(embed);
}

module.exports.config = {
    name: "ping",
    description: "отображает текущий ping",
    usage: "~ping",
    accessableby: "Members",
    aliases: ['c', 'purge']
}