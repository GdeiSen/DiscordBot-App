const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");
const { CommandBuilder } = require("../../builders/commandDataBuilder");
const progressbar = require("string-progressbar")
const embedGenerator = require("../../utils/embedGenerator")
const previous = require('./previous');
const skip = require('./skip');
const songLoop = require('./loop');
const stop = require('./stop');
const pause = require('./pause');
const resume = require('./resume');

/**
 * Sends a dynamically updated panel to control the playback
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.channel Discord text channel for specifying the way to send response messages
 */
module.exports.run = async (data) => {
    let guild = data.guild;
    let channel = data?.message?.channel || data.channel;
    let queue = data.guild.queue;
    let message = data.message;

    try { guild.activeCollectors.playerCollector.stop(); } catch (e) { }
    if (guild.activeEmbeds.playerEmbed) guild.embedManager.delete(guild?.activeEmbeds.playerEmbed)
    let song = queue.current;
    let playerEmbed;
    let row
    let activePlayerEmbed

    if (queue.current && queue.status == 'playing') {
        row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("pause")
                .setEmoji("⏯️")
                .setLabel(embedGenerator.run('direct.music.player.pauseResume_button'))
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("stop")
                .setLabel(embedGenerator.run('direct.music.player.stop_button'))
                .setEmoji("⏹️")
                .setStyle("DANGER"),
            new MessageButton()
                .setCustomId("prev")
                .setEmoji("⏮️")
                .setLabel(embedGenerator.run('direct.music.player.previous_button'))
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("next")
                .setEmoji("⏭️")
                .setLabel(embedGenerator.run('direct.music.player.next_button'))
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("loop")
                .setEmoji("🔂")
                .setLabel(embedGenerator.run('direct.music.player.loop_button'))
                .setStyle("SECONDARY")
        );

        let filter = item => item.customId === "next" || item.customId === "last" || item.customId === "pause" || item.customId === "stop" || item.customId === "loop" || item.customId === "prev";
        let collector = channel.createMessageComponentCollector({ filter, time: 300000 });
        guild.activeCollectors.playerCollector = collector;

        collector.on('collect', async item => {
            switch (item.customId) {
                case "pause":
                    if (queue.status == 'paused') resume.run(data);
                    else pause.run(data);
                    item.deferUpdate();
                    break;
                case "stop":
                    stop.run(data);
                    item.deferUpdate();
                    break;
                case "prev":
                    previous.run(data);
                    item.deferUpdate();
                    break;
                case "next":
                    skip.run(data);
                    item.deferUpdate();
                    break;
                case "loop":
                    if (queue.current.loop == true) songLoop.run({ guild: guild, channel: data.channel, args: "false", forceSend: true });
                    else songLoop.run({ guild: guild, channel: data.channel, args: "true", forceSend: true });
                    item.deferUpdate();
                    break;
                default:
                    break;
            }
        });
    }

    if (!queue.current && queue.status !== 'playing') return 0;
    playerEmbed = embedGenerator.run('music.play.info_07', { url: song.url, description: song.description ? song.description : "no description for this song!", image: song.thumbnail.url, add: { title: `\n${song.title} \n` } });
    playerEmbed
        .addField(embedGenerator.run('direct.music.player.duration_01'), `⏱ ${song.durationInSec !== 0 ? song.durationRaw : embedGenerator.run('direct.music.player.duration_02')}`, true)
        .addField(embedGenerator.run('direct.music.player.request'), `🗿 ${song.author}`, true)
        .addField(embedGenerator.run('direct.music.player.loop'), `🔁 ${song.loop || false}`, true)
        .addField(embedGenerator.run('direct.music.player.next_01'), `📢 ${queue.songs[0] ? queue.songs[0].title : embedGenerator.run('direct.music.player.next_02')}`, false)
    activePlayerEmbed = await guild.embedManager.send({ embeds: [playerEmbed], components: [row] }, { replyTo: message, channel: channel, embedTimeout: 'none' });
    if (guild.params.liveTimestamp == true) {
        guild.activeIntervals.timestampInterval = setInterval(() => {
            if (guild.queue.status !== 'playing') return 0;
            let current = getCurrentTimestamp(guild);
            let embedWithTimestamp = activePlayerEmbed.embeds[0];
            let timeStampField = { value: `${toHHMMSS(current)} [${progressbar.splitBar(song.durationInSec, current, 17)[0]}] ${toHHMMSS(song.durationInSec)}`, name: `Current playback:`, inline: false }
            if (!embedWithTimestamp.fields[4]) embedWithTimestamp.fields.push(timeStampField)
            embedWithTimestamp.fields[4] = timeStampField;
            guild.embedManager.edit(activePlayerEmbed, { embeds: [embedWithTimestamp] })
        }, 5000);
    }

    guild.activeEmbeds.playerEmbed = activePlayerEmbed;
    return { activeEmbeds: { playerEmbed: activePlayerEmbed }, result: true }

};

module.exports.addListeners = (guild) => {
    guild.playerManager.on('PLAYBACK_STARTED', () => {
        if (guild.params.playerAutoSend == true) this.run({ guild: guild, channel: guild.textChannel })
    })
    guild.playerManager.on('PLAYBACK_STOPPED', () => {
        clearInterval(guild.activeIntervals.timestampInterval);
        guild.embedManager.deleteAllActiveEmbeds();
    })
}

const data = new CommandBuilder()
data.setName('player')
data.setDescription('Sends a dynamically updated panel to control the playback')
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"])
data.setCategory('music')
module.exports.data = data;

function toHHMMSS(timestamp) {
    var sec_num = parseInt(timestamp, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    if (hours == 0) { return minutes + ':' + seconds }
    else { return hours + ':' + minutes + ':' + seconds }
}

function getCurrentTimestamp(guild) {
    let playbackDuration = new Date(guild.playerManager.player._state.resource.playbackDuration);
    let seconds = (playbackDuration.getSeconds() + (playbackDuration.getMinutes() * 60) + ((playbackDuration.getHours() - 3) * 360))
    return seconds;
}