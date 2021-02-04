const Discord = require("discord.js")

module.exports.run = async (bot, message, args) =>{

    let embed1 = new Discord.MessageEmbed()
            .setTitle(`Ошибка`)
            .setDescription(`**Вы забыли ввести число!**`)
            .setColor('RED')
    
    let embed2 = new Discord.MessageEmbed()
            .setTitle(`Ошибка`)
            .setDescription(`**Введен неверный вид числа**`)
            .setColor('RED')

    let embed3 = new Discord.MessageEmbed()
            .setTitle(`Ошибка`)
            .setDescription(`**Введите число меньше 100**`)
            .setColor('RED')

    let embed4 = new Discord.MessageEmbed()
            .setTitle(`Ошибка`)
            .setDescription(`**Введите число больше чем ноль**`)
            .setColor('RED')

    const arggs = message.content.split(' ').slice(1); 
    const amount = arggs.join(' ');
    
    if (!amount) return message.channel.send(embed1)
    .then (message => message.delete({ timeout : 5000 }));
    if (isNaN(amount)) return message.channel.send(embed2)
    .then (message => message.delete({ timeout : 5000 }));
    if (amount > 100) return message.channel.send(embed3)
    .then (message => message.delete({ timeout : 5000 })); 
    if (amount < 1) return message.channel.send(embed4)
    .then (message => message.delete({ timeout : 5000 })); 
    const num = Number(amount) + 1;
    async function delete_messages() {

    await message.channel.messages.fetch({
        limit: num
    }).then(messages => {
        message.channel.bulkDelete(messages)
        if (num === 2){
        let embed = new Discord.MessageEmbed()
            
            .setDescription(`**Удалено ${num - 1} сообщение**`)
            .setColor('GREEN')
        message.channel.send(embed)
        .then (message => message.delete({ timeout : 2000 }))}
        else if (num === 3 || num === 4 || num === 5){
            let embed = new Discord.MessageEmbed()
            
            .setDescription(`**Удалено ${num - 1} сообщения**`)
            .setColor('GREEN')
            message.channel.send(embed)
            .then (message => message.delete({ timeout : 2000 }))}
        else if (num > 2){
        let embed = new Discord.MessageEmbed()
            .setDescription(`**Удалено ${num - 1} сообщений**`)
            .setColor('GREEN')
        message.channel.send(embed)
        .then (message => message.delete({ timeout : 2000 }))}
        
        
    })
};
delete_messages(); // Вызов асинхронной функции
}

module.exports.config = {
    name: "clear",
    description: "Удаляет заданное количество сообщений",
    usage: "~claer",
    accessableby: "Members",
    aliases: ['c', 'cl']
}