module.exports.run = async (bot, message, args) => {
    message.channel.send({ content: 'https://tenor.com/view/bear-dance-move-cute-gif-10759975' })
}

module.exports.config = {
    name: "party",
    description: "Sends a gif message of a dancing bear",
    usage: "~party",
    accessableby: "Members",
    aliases: ['prty'],
    category: "entertainment",
    accesTest: "none"
}