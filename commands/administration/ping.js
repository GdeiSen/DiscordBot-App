const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Displays the description of the commands
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.client The current main client of this bot
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
    let message = data.message;
    let guild = data.guild;
    let client = data?.client || message.client;

    guild.embedManager.send({ embeds: [embedGenerator.run('info.ping.info_01', { add: { description: ` **${Math.round(client.ws.ping)} ms**` } })] }, { replyTo: message })
}

const data = new CommandBuilder()
data.setName('ping')
data.setDescription('Displays the current ping')
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;