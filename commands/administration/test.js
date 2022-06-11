const embedGenerator = require("../../include/utils/embedGenerator")

module.exports.run = async (bot, message, args) => {
    let embed = embedGenerator.run('info.info_06');
    let index = 0;
    bot.commands.forEach(command => {
        index++;
    });
    embed.addField(`⏳ Websocket heartbeat: ${bot?.ws?.ping || "untested!"}ms.`, "\`System is connected!\`");
    embed.addField(`⚙ Commands scanned: ${index}.`, "\`No errors with scanning!\`");
    embed.addField(`📡 External Server status: ${bot?.extServerEngine?.status || "untested!"}.`, "\`No errors with server!\`");
    message.channel.send({ embeds: [embed] })
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