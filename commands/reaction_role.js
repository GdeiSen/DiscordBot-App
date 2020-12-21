const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setTitle('testing_reactions')
    .setDescription('testing_completed')
    .setColor('GREEN')
    let msgEmbed = await message.channel.send(embed)
    msgEmbed.react('🧄')


client.on("messageReactionAdd",async (reaction, user)=>{
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(user.bot) return;
    if(!reaction.message.guild) return;
    if(reaction.message.channel.id === "780818320512253952") {
        if (reaction.emoji.name === '🧄'){
            await reaction.message.guild.members.cache.get(user.id).roles.add("781954585341460522")
        }
    }
})
client.on("messageReactionRemove",async (reaction, user)=>{
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(user.bot) return;
    if(!reaction.message.guild) return;
    if(reaction.message.channel.id === "780818320512253952") {
        if (reaction.emoji.name === '🧄'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove("781954585341460522")
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