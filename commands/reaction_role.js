const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setTitle('Присоединение к NoGamingWeeks отряду')
    .setDescription('Нажмите на ok чтобы вступить и еще раз, чтобы сдаться\nИ не забывайте об осознанном выборе и решении')
    .setColor('RED')
    let msgEmbed = await message.channel.send(embed)
    msgEmbed.react('🆗')


client.on("messageReactionAdd",async (reaction, user)=>{
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(user.bot) return;
    if(!reaction.message.guild) return;
    if(reaction.message.channel.id === "780086468944199709") {
        if (reaction.emoji.name === '🆗'){
            await reaction.message.guild.members.cache.get(user.id).roles.add("827289516095701033")
        }
    }
})
client.on("messageReactionRemove",async (reaction, user)=>{
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(user.bot) return;
    if(!reaction.message.guild) return;
    if(reaction.message.channel.id === "780086468944199709") {
        if (reaction.emoji.name === '🆗'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove("827289516095701033")
        }
    }
})
}
module.exports.config = {
    name: "react_role",
    description: "Тестовая комманда для выдачи роли по нажатию на реакцию",
    usage: "~react_role",
    accessableby: "Members",
    aliases: []
}