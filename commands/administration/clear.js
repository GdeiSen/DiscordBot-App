text = require("../../data/text_packs/en.json")
const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Deletes the specified number of messages
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
    let num = Number(args) + 1;

    if (!args) return guild.embedManager.send({ embeds: [embedGenerator.run('warnings.clear.error_01')] }, { replyTo: message })
    if (isNaN(args)) return guild.embedManager.send({ embeds: [embedGenerator.run('warnings.clear.error_02')] }, { replyTo: message })
    if (args > 100) return guild.embedManager.send({ embeds: [embedGenerator.run('warnings.clear.error_03')] }, { replyTo: message })
    if (args < 1) return guild.embedManager.send({ embeds: [embedGenerator.run('warnings.clear.error_04')] }, { replyTo: message })

    await message.channel.messages.fetch({
        limit: num
    }).then(messages => {
        message.channel.bulkDelete(messages)?.catch((err) => { })
        guild.embedManager.send({ embeds: [embedGenerator.run('warnings.clear.info_01', { add: { description: `${num - 1}` } })] }, { replyTo: message })
    })
}

const data = new CommandBuilder()
data.setName('clear')
data.addIntegerOption(option =>
    option.setName('number')
        .setDescription('Messages to delete')
        .setMaxValue(100)
        .setMinValue(1)
        .setRequired(true))
data.setDescription('Deletes the specified number of messages')
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;