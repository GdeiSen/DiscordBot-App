const embedGenerator = require("../../utils/embedGenerator");
const progressbar = require('string-progressbar');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
module.exports.sendSongErrorEmbed = (channel) => {
    let addedEmbed = new MessageEmbed()
        .setColor("BLACK")
        .setTitle(`❌  Unfortunately not found!`, `Data by your request not found! Please try again`)
        .setDescription(`Data by your request is not found! Please try again`, true);
    channel.send({ embeds: [addedEmbed] });
}

module.exports.sendQueryErrorEmbed = (channel) => {
    let addedEmbed = new MessageEmbed()
        .setColor("BLACK")
        .setTitle(`❌  Unfortunately not found!`, `Data by your request not found! Please try again`)
        .setDescription(`Data by your request is not found! Please try again`, true);
    channel.send({ embeds: [addedEmbed] }).catch(console.error);
}

module.exports.sendSongLoopEmbed = (channel, params) => {
    let embed;
    if (params?.state == true) embed = embedGenerator.run("music.loop.info_01");
    if (params?.state == false) embed = embedGenerator.run("music.loop.info_02");
    if (params.warning == 'incorrect_args') { embed = embedGenerator.run("music.loop.error_01"); };
    channel.send({ embeds: [embed] }).catch(console.error);
}

module.exports.sendEmbed = (channel, params) => {
    let embed;
    if (params?.state == true) embed = embedGenerator.run("music.loop.info_01");
    if (params?.state == false) embed = embedGenerator.run("music.loop.info_02");
    if (params.warning == 'incorrect_args') { embed = embedGenerator.run("music.loop.error_01"); };
    channel.send({ embeds: [embed] }).catch(console.error);
}

module.exports.sendQueueLoopEmbed = (channel, params) => {
    let embed;
    if (params?.state == true) embed = embedGenerator.run("music.queueLoop.info_01");
    if (params?.state == false) embed = embedGenerator.run("music.queueLoop.info_02");
    if (params?.warning == 'incorrect_args') { embed = embedGenerator.run("music.queueLoop.error_01") };
    channel.send({ embeds: [embed] }).catch(console.error);
}

module.exports.sendPausedEmbed = async (channel, params) => {
    let embed;
    if (params.queueStatus == 'playing') { embed = embedGenerator.run("music.pause.info_01") }
    else { embed = embedGenerator.run("music.pause.info_02") }
    channel.send({ embeds: [embed] }).catch(console.error)
}

module.exports.sendResumeEmbed = async (channel, params) => {
    let embed;
    if (params.queueStatus == 'paused') { embed = embedGenerator.run("music.resume.info_01") }
    else { embed = embedGenerator.run("music.resume.info_02") }
    channel.send({ embeds: [embed] }).catch(console.error)
}

module.exports.sendRemoveEmbed = async (channel, params) => {
    let embed;
    if (params?.warning == "incorrect_args") { embed = embedGenerator.run("music.remove.error_01") }
    else { embed = embedGenerator.run("music.remove.info_01") }
    channel.send({ embeds: [embed] }).catch(console.error);
}

module.exports.sendShuffleEmbed = async (channel) => {
    let embed = await embedGenerator.run('music.shuffle.info_01');
    channel.send({ embeds: [embed] }).catch(console.error);
}

module.exports.sendSkipEmbed = (channel) => {
    let embed = embedGenerator.run('music.skip.info_01');
    channel.send({ embeds: [embed] }).catch(console.error);
}

module.exports.sendSkipToEmbed = (channel, params) => {
    let embed
    if (params?.warning == 'incorrect_args') { embed = embedGenerator.run("music.skipto.error_01") }
    else { embed = embedGenerator.run('music.skipto.info_01') }
    channel.send({ embeds: [embed] }).catch(console.error);
}

module.exports.sendStopEmbed = (channel) => {
    let embed = embedGenerator.run('music.stop.info_01');
    channel.send({ embeds: [embed] }).catch(console.error);
}

module.exports.sendVolumeEmbed = (channel, params) => {
    let embed
    if (params?.warning == 'incorrect_args') { embed = embedGenerator.run("music.volume.error_01") }
    else { embed = embedGenerator.run("music.volume.info_01"); embed.setTitle(`${embed.title} ${params?.state}`) }
    channel.send({ embeds: [embed] }).catch(console.error);;
}

module.exports.sendSongEmbed = async (queue, channel) => {
    if (channel?.activeCollector) channel.activeCollector.stop();
    let filter = item => item.customId === "next" || item.customId === "last" || item.customId === "pause" || item.customId === "stop" || item.customId === "queueLoop";
    let collector = channel.createMessageComponentCollector({ filter, time: 160000, });
    channel.activeCollector = collector;
    let song = queue.current;
    let row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("last")
            .setEmoji("⏮️")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("next")
            .setEmoji("⏭️")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("pause")
            .setEmoji("⏯️")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("stop")
            .setEmoji("⏹️")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("queueLoop")
            .setEmoji("🔂")
            .setStyle("PRIMARY")
    );
    let addedEmbed = new MessageEmbed()
        .setColor("BLACK")
        .setTitle(`📢   Now Playing:\n${song.title} \n`)
        .setImage(song.thumbnail)
        .addField(`⠀`, `⏱ Duration: \`${song.durationRaw}\` \n🗿 By User: \`${song.author}\` \n🔁 Queue Loop: \`${queue.config.loop}\` \n📢 Next: \`${queue.songs[0] ? queue.songs[0].title : "nothing"}\``, true)
        .setDescription(song.description ? song.description : "no description for this song!")
        .setURL(song.url);
    try {
        collector.on("collect", async (item) => {
            if (item.customId === "next") {
                queue.playerManager.skip();
            } else if (item.customId === "last") {
                queue.playerManager.skip();
            } else if (item.customId === "pause") {
                queue.playerManager.togglePause();
            } else if (item.customId === "stop") {
                queue.playerManager.stop();
            } else if (item.customId === "queueLoop") {
                queue.playerManager.toggleSongLoop();
            }
            item.deferUpdate();
        });
    } catch (err) { console.log(err) }
    let activeSongEmbed = await channel.send({
        embeds: [addedEmbed], components: [row],
    });
    collector.on("end", async (i) => {
        activeSongEmbed.edit({
            components: [],
        }).catch((err)=>{});
    });
}

module.exports.sendQueueEmbed = async (channel, queue) => {
    try {
        if (channel?.activeCollector) channel.activeCollector.stop();
        let currentPage = 0;
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('back')
                    .setEmoji('◀️')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('next')
                    .setEmoji('▶️')
                    .setStyle('PRIMARY'),
            );
        const embeds = await generateQueueEmbed(queue.songs, queue.current);
        let queueEmbed = await channel.send({
            content: 'Queue',
            embeds: [embeds[currentPage]],
            components: [row]
        });
        const filter = i => i.customId === 'next' || i.customId === 'back';
        collector = channel.createMessageComponentCollector({
            filter,
            time: 15000
        });
        channel.activeCollector = collector;
        collector.on('collect', async item => {
            try {
                if (item.customId === 'next') {
                    messageIndex = item;
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        await item.update({
                            content: `**page - ${currentPage + 1}/${embeds.length}**`,
                            embeds: [embeds[currentPage]]
                        });
                    } else { item.deferUpdate(); }
                } else if (item.customId === 'back') {
                    if (currentPage !== 0) {
                        --currentPage;
                        await item.update({ content: `**page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]] });
                    }
                    else { item.deferUpdate(); }
                }
            } catch (err) { }
        });
        collector.on('end', async i => {
            queueEmbed.edit({
                content: `**page - ${currentPage + 1}/${embeds.length}**`,
                embeds: [embeds[currentPage]],
                components: []
            }).catch((err)=>{})
        })
    } catch (err) { console.log(err) }
}

module.exports.sendNowPlayingEmbed = async (queue, channel) => {
    let next;
    let current;
    let song = queue.current;
    let total = song.durationInSec;
    let nowPlaying = await embedGenerator.run('music.nowPlaying.info_01');
    if (queue.songs[0]) { next = queue.songs[0].title } else next = 'nothing!'
    if (!song.live) current = getCurrentTimestamp(song);
    nowPlaying
        .setDescription(`**${song.title}**\n${song.url}`)
        .setThumbnail(song.thumbnail)
    if (queue.status == 'playing' && current) nowPlaying.addField(`${toHHMMSS(current)} [${progressbar.splitBar(total, current, 20)[0]}] ${toHHMMSS(song.durationInSec)}`, `Next: ${next}`, true);
    else if (queue.status == 'playing' && !current) nowPlaying.addField(`LIVE!`, `Next: ${next}`, true);
    else if (queue.status !== 'playing') nowPlaying.addField(`Paused!`, `Next: ${next}`, true);
    return channel.send({ embeds: [nowPlaying] });
}

async function generateQueueEmbed(queue, current_) {
    let embeds = [];
    let k = 10;
    let currentSong = current_;
    if (queue.length == 0) {
        let embed = await embedGenerator.run('music.queue.info_02');
        embed
            .setThumbnail(currentSong.thumbnail)
            .setDescription(`**${embed.description} - [${currentSong.title}](${currentSong.url})**\n\nEmpty!`)
        embeds.push(embed);
    } else {
        for (let i = 0; i < queue.length; i += 10) {
            const current = queue.slice(i, k);
            let j = i;
            k += 10;
            const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");
            let embed = await embedGenerator.run('music.queue.info_02');
            embed
                .setThumbnail(currentSong.thumbnail)
                .setDescription(`**${embed.description} - [${currentSong.title}](${currentSong.url})**\n\n${info}`)
            embeds.push(embed);
        }
    }
    return embeds;
}

module.exports.sendPlaybackStoppedEmbed = (channel) => {
    let embed = embedGenerator.run("music.play.info_03");
    channel.send({ embeds: [embed] });
}

module.exports.sendShuffleEmbed = (channel) => {
    let embed = embedGenerator.run("music.shuffle.info_01");
    channel.send({ embeds: [embed] });
}

module.exports.sendPlaylistLoadingEmbed = (channel) => {
    let embed = embedGenerator.run("music.playlist.info_02");
    channel.send({ embeds: [embed] });
}

module.exports.sendNotFoundEmbed = (channel) => {
    let embed = embedGenerator.run("music.play.info_06");
    channel.send({ embeds: [embed] });
}

module.exports.sendSongAddedEmbed = (song, channel) => {
    let embed = embedGenerator.run("music.play.info_05");
    embed.setDescription(`${embed.description} **${song.title}**`);
    embed.setURL(song.url);
    embed.setThumbnail(song.thumbnail?.url ? song.thumbnail.url : song.thumbnails[0].url)
    channel.send({ embeds: [embed] });
}

module.exports.sendPlaylistAddedEmbed = (playlist, channel) => {
    let embed = embedGenerator.run("music.playlist.info_01");
    embed.setDescription(`${embed.description} **${playlist.title ? playlist.title : playlist.name}**`);
    embed.setURL(playlist.url);
    embed.setThumbnail(playlist.thumbnail.url)
    channel.send({ embeds: [embed] });
}

module.exports.sendDisconnectedEmbed = (channel) => {
    let embed = embedGenerator.run("music.play.info_04");
    channel.send({ embeds: [embed] });
}

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

function getCurrentTimestamp(song) {
    if (song.totalPausedTime) { current = ((new Date().getTime() - song.startTime) / 1000) - (song.totalPausedTime / 1000) } else current = (new Date().getTime() - song.startTime) / 1000;
    return current;
}