const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Changes the prefix of the bot to activate commands
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

    if (!args) {
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.prefix.error_02')] }, { replyTo: message })
    }
    if (args?.length > 10) {
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.prefix.error_01')] }, { replyTo: message })
    }
    else {
        params.prefix = args;
        return guild.embedManager.send({ embeds: [embedGenerator.run('info.prefix.info_01', { add: { title: ` ${args}` } })] }, { replyTo: message })
    }
};

const data = new CommandBuilder()
data.setName('set-prefix')
data.addStringOption(option =>
    option.setName('prefix')
        .setDescription('Prefix name')
        .setRequired(true))
data.setDescription('Changes the prefix of the bot to activate commands')
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;