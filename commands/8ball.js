const Discord = require("discord.js")

module.exports.run = async(message, args) => {
    var arggs = args;
    let random = Math.floor(Math.random() * 20) + 1;
    if (random === 1) {
        var messagec = "Определенно да!";
    } 
    else if (random === 20) {
        var messagec = "Никаких сомнений";
    }
    else if (random === 2) {
        var messagec = "Предрешено";
    }
    else if (random === 19) {
        var messagec = "Можешь быть уверен в этом";
        }
    else if (random === 3) {
        var messagec = "Бесспорно";
        }
    else if (random === 18) {
        var messagec = "Мне кажется - да?";
        }
    else if (random === 4) {
        var messagec = "Вероятнее всего";
        }
    else if (random === 17) {
        var messagec = "Хорошие перспективы";
        }
    else if (random === 5) {
        var messagec = "Занки говорят - да"
        }
    else if (random === 16) {
        var messagec = "Наверное да";
        }
    else if (random === 6) {
        var messagec = "Пока не ясно, попробуй снова";
        }
    else if (random === 15) {
        var messagec = "Спроси позже";
        }
    else if (random === 7) {
        var messagec = "Лучше не рассказывать";
        }
    else if (random === 14) {
        var messagec = "Сейчас нельзя предсказать";
        }
    else if (random === 8) {
        var messagec = "Сконцетрируйся и спроси опять";
        }
    else if (random === 13) {
        var messagec = "Даже не думай";
        }
    else if (random === 9) {
        var messagec = "Мой ответ - Нет";
        }
    else if (random === 12) {
        var messagec = "По моим данным - Нет";
        }
    else if (random === 10) {
        var messagec = "Переспективы не очень хорошие";
        }
    else if (random === 11) {
        var messagec = "Весьма сомнительно";
        }
    let embed = new Discord.MessageEmbed()
    .setTitle(`${messagec}`)
    .setDescription(`${arggs}`)
    .setColor('PURPLE')
    message.channel.send(embed)
}


module.exports.config = {
    name: "8ball",
    usage: "~8ball",
    description: "Выводит твой приговор судьбы",
    accessableby: "Members",
    aliases: ['c', 'purge']
}