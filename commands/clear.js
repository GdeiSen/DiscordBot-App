const Discord = require("discord.js")
text = require("../text_packs/en.json")
const embedGenerator = require("../include/embedGenerator")
module.exports.run = async (bot, message, args) =>{

    let embed1 = await embedGenerator.run('warnings.clear.error_01');
    let embed2 = await embedGenerator.run('warnings.clear.error_02');
    let embed3 = await embedGenerator.run('warnings.clear.error_03');
    let embed4 = await embedGenerator.run('warnings.clear.error_04');
    let embed = await embedGenerator.run('warnings.clear.info_01');
    
    if (!args) return message.channel.send({embeds:[embed1]})
    .then (message => {setTimeout(() => message.delete(), 5000)});

    if (isNaN(args)) return message.channel.send({embeds:[embed2]})
    .then (message => {setTimeout(() => message.delete(), 5000)});

    if (args > 26) return mes = message.channel.send({embeds:[embed3]})
    .then (message => {setTimeout(() => message.delete(), 5000)});

    if (args < 1) return mes = message.channel.send({embeds:[embed4]})
    .then (message => {setTimeout(() => message.delete(), 5000)});

    const num = Number(args) + 1;
    async function delete_messages() {

    await message.channel.messages.fetch({
        limit: num
    }).then(messages => {
        message.channel.bulkDelete(messages)
        embed.setDescription(embed.description + `${num - 1}`)
        message.channel.send({embeds:[embed]})
        .then (message => {setTimeout(() => message.delete(), 5000)})})
};
delete_messages();
}

module.exports.config = {
    name: "clear",
    description: "Deletes the specified number of messages",
    usage: "~clear",
    accessableby: "Members",
    aliases: ['c', 'cl'],
    category: "admin"
}