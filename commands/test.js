const Discord = require("discord.js")
const botconfig = require("../config.json");

module.exports.run = async (bot, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setTitle('Тест')
    .setDescription('**функция теста бота завершена!**')
    .setColor('GREEN')
    message.channel.send(embed)
}

module.exports.config = {
    name: "test",
    description: "Тестовая комманда для проверки работоспособности бота",
    usage: "~test",
    accessableby: "Members",
    aliases: ['c', 'purge']
}