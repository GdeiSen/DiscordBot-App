const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Changes max previous queue size value
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
    let message = data.message;
    let args = data.args;
    let params = data.guild.params;
    let guild = data.guild;

    args = Number(args);
    if (!args || typeof Number(args) !== "number") {
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.maxPrevQueueSize.error_03')] }, { replyTo: message })
    }
    if (args > 400) {
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.maxPrevQueueSize.error_01')] }, { replyTo: message })
    }
    if (args <= 1) {
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.maxPrevQueueSize.error_02')] }, { replyTo: message })
    }
    else {
        params.maxPrevQueueSize = args;
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.maxPrevQueueSize.error_01', { add: { title: ` ${args}` } })] }, { replyTo: message })
    }
};

const data = new CommandBuilder()
data.setName('set-max-prev-queue-size')
data.addIntegerOption(option =>
    option.setName('size')
        .setDescription('Max Previous Queue Size')
        .setRequired(true)
        .setMaxValue(400)
        .setMinValue(1))
data.setDescription('Changes max previous queue size value')
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;