const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")
const player = require('./player')

/**
 * Starts the playback of current queue
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
    let guild = data.guild;
    let queue = data.guild.queue;
    let message = data.message;
    let embed = embedGenerator.run('music.startPlayback.error_01');

    if (queue.status !== "pending" || queue?.songs?.length == 0) return { sendData: { embeds: [embed], params: { replyTo: message } }, result: false }
    guild.playerManager.startPlayback(message.member.voice.channel, message.channel);
    embed = embedGenerator.run('music.startPlayback.info_01');

    playerAutoSend = () => {
        if (guild.params.playerAutoSend == true) player.run({ guild: guild, channel: message.channel })
    }
    guild.playerManager.removeAllListeners('PLAYBACK_STARTED')
    guild.playerManager.on('PLAYBACK_STARTED', playerAutoSend);

    activeClean = () => {
        if (guild.params.activeClean == true) guild.embedManager.deleteAllActiveEmbeds();
    }
    guild.playerManager.removeAllListeners('PLAYBACK_STOPPED');
    console.log(guild.playerManager.listenerCount('PLAYBACK_STARTED'));
    guild.playerManager.on('PLAYBACK_STOPPED', activeClean);

    return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};


const data = new CommandBuilder()
data.setName('start-playback')
data.setDescription('Starts the playback of current queue')
data.setMiddleware(["testUserId", "testSameUserBotLocation", "testUserVoiceChannelAvailability", "testAudioPermissions", "testArgs"]);
data.setCategory('music')
module.exports.data = data;