const Discord = require("discord.js")
const botconfig = require("../config.json");

module.exports.run = async (bot, message, args) => {
    message.channel.send('Loading_Test')
    let embed = new Discord.MessageEmbed()
    .setTitle('testing_title')
    .setDescription('testing_reaction')
    .setColor('GREEN')
    let msgEmbed = await message.channel.send(embed)
    msgEmbed.react('1️⃣');
    msgEmbed.react('2️⃣');
    msgEmbed.react('3️⃣');
    msgEmbed.react('4️⃣');
    msgEmbed.react('5️⃣');
}

module.exports.config = {
    name: "test",
    description: "testing",
    usage: "~test",
    accessableby: "Members",
    aliases: ['c', 'purge']
}