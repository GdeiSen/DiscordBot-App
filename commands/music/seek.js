const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Pauses the playback
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
    let guild = data.guild;
    let message = data?.message;
    let args = data.args;


    args = Number(args);
    
    if (args > guild.queue.current.durationInSec || args < 0 || !args) return { sendData: { embeds: [embedGenerator.run('music.seek.error_01')], params: { replyTo: message } }, result: true }

    guild.queue.isSeek = true;
    guild.playerManager.player.seekPoint = args;
    guild.playerManager.startPlayback({ seek: args });

    return { sendData: { embeds: [embedGenerator.run('music.seek.info_01')], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('seek')
data.addStringOption(option =>
    option.setName('time')
        .setDescription('Time point in seconds')
        .setRequired(true))
data.setDescription('Seek the point in the current playback')
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;