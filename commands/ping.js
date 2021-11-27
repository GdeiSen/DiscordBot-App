const Discord = require("discord.js")
const embedGenerator = require("../include/utils/embedGenerator")

module.exports.run = async (bot, message, args) => {
    let embed = await embedGenerator.run('info.ping.info_01');
    embed.setDescription(`${embed.description} **${Math.round(message.client.ws.ping)} ms**`)
    message.channel.send({embeds:[embed]});
}

module.exports.config = {
    name: "ping",
    description: "displays the current ping",
    usage: "~ping",
    accessableby: "Members",
    aliases: ['pg'],
    category: "admin",
    accesTest: "none"
}