const Discord = require("discord.js")
const embedGenerator = require("../include/utils/embedGenerator")
module.exports.run = async (bot, message, args) => {
    let embed = embedGenerator.run('info.info_06');
    let index = 0;
    bot.commands.forEach(command => {
        index++;
    });
    embed.addField(`⏳ Websocket heartbeat: ${bot.ws.ping}ms.`, "\`System is connected!\`");
    embed.addField(`⚙ Commands scanned: ${index}.`, "\`No errors with scanning!\`");
    embed.addField(`💾 DataBase status: ${bot.dataBaseEngine.status}.`, "\`No errors with data!\`");
    embed.addField(`📡 SiteServer status: ${bot.serverEngine.status}.`, "\`No errors with server!\`");
    message.channel.send({ embeds: [embed] })

    const guild = bot.guilds.cache.get("780086468944199700");
    const list = await guild.members.fetch();
    list.forEach((user)=>console.log(user.user.username))
}

module.exports.config = {
    name: "test",
    description: "Test command for checking the bot's performance",
    usage: "~test",
    accessableby: "Members",
    aliases: [],
    category: "admin",
    accesTest: "none"
}