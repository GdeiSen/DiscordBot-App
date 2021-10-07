const Discord = require("discord.js")

module.exports.run = async (bot,message, args) => {
    let error_text = new Discord.MessageEmbed()
            .setTitle('ошибка')
            .setDescription('**Возможно вы допустили ошибку в синтаксисе комманды**')
            .setColor('RED')
    try{
    var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
    }
    catch(error){message.channel.send(error_text);return}
    if (message.member.id === "614819288506695697"){
    if(!message.member.hasPermission(['ADMINISTRATOR'])) return;
    if(member.hasPermission(['ADMINISTRATOR']) && !message.member.hasPermission('ADMINISTRATOR')) return;

        let mutedRole = message.guild.roles.cache.get('780109552037265419');
        let verifiedRole = message.guild.roles.cache.get('780090984896790548');
        if(mutedRole) {
            member.roles.remove(mutedRole);
            member.roles.add(verifiedRole);
            let embed = new Discord.MessageEmbed()
            .setTitle('MUTE')
            .setDescription('**Я думаю он исправился**')
            .setColor('GREEN')
            message.channel.send(embed)
        }
}
else if(message.member.id != "614819288506695697"){
    let embed = new Discord.MessageEmbed()
            .setTitle('ошибка')
            .setDescription('**У вас нет прав на исполльзование этой комманды.**')
            .setColor('RED')
            message.channel.send(embed)
}
}
module.exports.config = {
    name: "unmute",
    description: "Removes the lock from the server participant (blocked!)",
    usage: "?unmute",
    accessableby: "Members",
    aliases: [],
    category: "test"
}