const Discord = require("discord.js")
text = require("../text_packs/en.json")
const embedGenerator = require("../include/embedGenerator")
module.exports.run = async (bot, message, args) =>{
    //message.channel.send(`${embedGenerator.run('direct.music.play.info_02_02').text}`)
    
    message.channel.send(`${embedGenerator.run('direct.music.play.info_02_01')} ${embedGenerator.run('direct.music.play.info_02_02')}`)
}

module.exports.config = {
    name: "directSearchTest",
    description: "Test Drect searching engine",
    usage: "~directSearchTest",
    accessableby: "Members",
    aliases: ['c', 'cl'],
    category: "test"
}