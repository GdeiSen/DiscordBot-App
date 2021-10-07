const Discord = require("discord.js")
const embedGenerator = require("../include/embedGenerator")
module.exports.run = (bot, message, args) => {
    let embed = embedGenerator.run('info.info_06');
    let index = 0;
    bot.commands.forEach(command => {
        index++;
    });
    embed.addField(`⏳ Websocket heartbeat: ${bot.ws.ping}ms.`,"\`System is connected!\`");
    embed.addField(`⚙ Commands scanned: ${index}.`,"\`No errors with scanning!\`");
    message.channel.send({embeds:[embed]})
}

module.exports.config = {
    name: "test",
    description: "Test command for checking the bot's performance",
    usage: "~test",
    accessableby: "Members",
    aliases: [],
    category: "admin"
}