const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Skips a track to previous one
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
    let message = data.message;
    let guild = data.guild;
    let prevSong = guild.queue.prevSongs[0];

    if (guild.queue?.current?.loop == true) return { sendData: { embeds: [embedGenerator.run('music.prev.error_01')], params: { replyTo: message } }, result: false }
    if (!prevSong) return { sendData: { embeds: [embedGenerator.run('music.prev.error_01')], params: { replyTo: message } }, result: false }
    if (guild.queue.status == 'paused') guild.guild.playerManager.player.resume();

    guild.queue.songs.unshift(guild.queue.current);
    guild.queue.songs.unshift(prevSong);
    guild.queue.prevSongs.splice(0, 1);
    guild.queueManager.setNextCurrentSong({ addSongToPrevQueue: false });
    guild.queue.status = 'pending';
    guild.queue.isSkipped = true;
    guild.playerManager.player.stop();
    guild.playerManager.startPlayback();

    return { sendData: { embeds: [embedGenerator.run('music.prev.info_01')], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('previous')
data.setDescription('Skips a track to previous one')
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;