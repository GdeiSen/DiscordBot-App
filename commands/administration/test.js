const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Test command for checking the bot's performance
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.client The current main client of this bot
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
    let message = data.message;
    let client = data.client;
    let embed = embedGenerator.run('info.info_06');
    let index = 0;

    client.commands.forEach(() => {
        index++;
    });

    embed.addFields({ name: `⏳ Websocket heartbeat: ${client?.ws?.ping || "untested!"}ms.`, value: "\`System is connected!\`" });
    embed.addFields({ name: `⚙ Commands scanned: ${index}.`, value: "\`No errors with scanning!\`" });
    embed.addFields({ name: `📡 External Server status: ${client?.extServerEngine?.status || "disconnected!"}.`, value: "\`No errors with server!\`" });

    return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
}

const data = new CommandBuilder()
data.setName('test')
data.setDescription("Test command for checking the bot's performance")
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;