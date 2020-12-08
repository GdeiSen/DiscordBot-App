const Discord = require("discord.js")
const botconfig = require("../config.json");

module.exports.run = async (bot, message, args) => {
    message.channel.send('Loading_Rules_Info')
    let embed = new Discord.MessageEmbed()
    .setTitle('ПРАВИЛА НАШЕГО СЕРВЕРА')
    .setDescription('**На сервере запрещается\n\n1. Оскорбление участников \n\n2. Нецензурная брань \n\n3. Медиа с оскорбительным подтекстом \n\n4. Медиа с порнографическим контентом\n\n5. Злоупотребление Caps Lock\n\n6. Домогаться до участников сервера \n\n7. Морально унижать участников сервера \n\n8. Наводить суицидальные мысли на участников сервера  \n\n9. Внушать свои политически взгляды \n\n10. Устраивать саботажи\n\n11. Распитие алкогольных напитков\n\n12. Конченная белорусская литература\n\n13. Унижение прав животных**')
    .setColor('ORANGE')
    message.channel.send(embed)
}

module.exports.config = {
    name: "rules",
    description: "giving rules",
    usage: "~rules",
    accessableby: "Members",
    aliases: ['c', 'purge']
}