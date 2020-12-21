const Discord = require("discord.js")
const botconfig = require("../config.json");

module.exports.run = async (bot, message, args) => {
    message.channel.send('https://tenor.com/view/bear-dance-move-cute-gif-10759975')
}

module.exports.config = {
    name: "party",
    description: "Высылает гиф сообщение танцуещего медведя",
    usage: "~party",
    accessableby: "Members",
    aliases: ['prty', 'pa']
}