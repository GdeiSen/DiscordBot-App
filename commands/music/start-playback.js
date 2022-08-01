const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")
const disconnect = require("./disconnect")

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
    guild.playerManager.startPlayback({ voiceChannel: message.member.voice.channel, textChannel: message.channel });
    embed = embedGenerator.run('music.startPlayback.info_01');

    guild.info.isPlayed = true;

    return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};

module.exports.addListeners = (guild) => {
    guild.playerManager.on('PLAYBACK_STOPPED', () => {
        guild.activeTimeouts.stayTimeout = setTimeout(() => {
            disconnect.run({ guild: guild })
        }, guild.params.stayTimeout);
    })
    guild.playerManager.on('PLAYBACK_STARTED', () => {
        clearTimeout(guild.activeTimeouts.stayTimeout)
    })
}

const data = new CommandBuilder()
data.setName('start-playback')
data.setDescription('Starts the playback of current queue')
data.setMiddleware(["testUserId", "testSameUserBotLocation", "testUserVoiceChannelAvailability", "testAudioPermissions", "testArgs"]);
data.setCategory('music')
module.exports.data = data;