const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");
const { CommandBuilder } = require("../../builders/commandDataBuilder");
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

    if (guild?.activeCollectors.playerCollector) guild.activeCollectors.playerCollector.stop();
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
                .setLabel("pause/resume")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("stop")
                .setLabel("stop")
                .setEmoji("⏹️")
                .setStyle("DANGER"),
            new MessageButton()
                .setCustomId("prev")
                .setEmoji("⏮️")
                .setLabel("prev")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("next")
                .setEmoji("⏭️")
                .setLabel("next")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("loop")
                .setEmoji("🔂")
                .setLabel("song loop")
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
                    songLoop.run(data);
                    item.deferUpdate();
                    break;
                default:
                    break;
            }
        });
    }

    if (queue.current && queue.status == 'playing') {
        playerEmbed = embedGenerator.run('music.play.info_07', { url: song.url, description: song.description ? song.description : "no description for this song!", thumbnail: song.thumbnail.url, add: { title: `\n${song.title} \n` } });
        playerEmbed
            .addField(`duration`, `⏱ ${song.durationInSec !== 0 ? song.durationRaw : "LIVE"}`, true)
            .addField(`requested by`, `🗿 ${song.author}`, true)
            .addField(`song loop`, `🔁 ${song.loop || false}`, true)
            .addField(`next in queue`, `📢 ${queue.songs[0] ? queue.songs[0].title : "nothing"}`, false)
        activePlayerEmbed = await guild.embedManager.send({ embeds: [playerEmbed], components: [row] }, { replyTo: message, channel: channel, embedTimeout: 'none' });
    }

    guild.activeEmbeds.playerEmbed = activePlayerEmbed;
    return { activeEmbeds: { playerEmbed: activePlayerEmbed }, result: true }

};

const data = new CommandBuilder()
data.setName('player')
data.setDescription('Sends a dynamically updated panel to control the playback')
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"])
data.setCategory('music')
module.exports.data = data;