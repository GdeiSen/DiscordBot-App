const { CommandBuilder } = require('../../builders/commandDataBuilder');
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Performs the bot's exit from the voice channel
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
    let message = data.message;
    let guild = data.guild;

    if (!guild?.playerManager) return { result: false }
    guild.playerManager.disconnect();
    return { result: true }
};

const data = new CommandBuilder()
data.setName('disconnect')
data.setDescription('Outputs the bot from the current voice channel')
data.setMiddleware([]);
data.setCategory('music')
module.exports.data = data;