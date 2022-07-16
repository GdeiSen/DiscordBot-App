const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Changes the stay duration value
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
    let message = data.message;
    let args = data.args;
    let guild = data.guild;
    let params = data.guild.params;

    args = Number(args);
    if (!args || typeof args !== "number") {
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.stayTimeout.error_03')] }, { replyTo: message })
    }
    if (args > 10000000) {
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.stayTimeout.error_01')] }, { replyTo: message })
    }
    if (args <= 0) {
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.stayTimeout.error_02')] }, { replyTo: message })
    }
    else {
        params.maxPlaybackDuration = args;
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.stayTimeout.info_01', { add: { title: ` ${args}` } })] }, { replyTo: message })
    }
};

const data = new CommandBuilder()
data.setName('set-stay-timeout')
data.addIntegerOption(option =>
    option.setName('duration')
        .setDescription('Stay duration in ms')
        .setRequired(true)
        .setMaxValue(10000000)
        .setMinValue(0))
data.setDescription('Changes the stay duration value')
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;