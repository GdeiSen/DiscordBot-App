const { CommandBuilder } = require("../../builders/commandDataBuilder")

module.exports.run = async (data) => {
    let message = data.message;
    let guild = data.guild;
    guild.embedManager.send({ content: 'https://tenor.com/view/bear-dance-move-cute-gif-10759975' }, { replyTo: message, embedTimeout: 'none' })
}

const data = new CommandBuilder()
data.setName('party')
data.setDescription('Sends a gif message of a dancing bear')
data.setCategory('entertainment');
data.setMiddleware([])
module.exports.data = data;