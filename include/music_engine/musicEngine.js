const { queueMaster } = require("./queueMaster.js");
const { MessageEmbed } = require("discord.js");
const { player } = require('./playerMaster')
const embedGenerator = require("../utils/embedGenerator")
module.exports.run = async (client, message, args, options) => {
    const QueueMaster = new queueMaster(client, message);
    const queue = QueueMaster.getQueue();
    if (!queue) createEngine(client, message);
    executeEngine(client, message, args, options);
}

async function createEngine(client, message) {
    const QueueMaster = new queueMaster(client, message);
    QueueMaster.createQueue();
    const queue = QueueMaster.getQueue();
    const Player = new player(message);
    queue.playerMaster = Player;
    queue.queueMaster = QueueMaster;

    queue.queueMaster.on('INFO', (text) => {
        console.log(text);
    })

    queue.queueMaster.on('ERROR', (text) => {
        console.error(text);
        let addedEmbed = new MessageEmbed()
            .setColor('BLACK')
            .setTitle(`❌  Unfortunately not found!`, `Data by your request not found! Please try again`)
            .setDescription(`Data by your  not found! Please try again`, true)
        message.channel.send({ embeds: [addedEmbed] });
    })

    queue.playerMaster.on('INFO', (text) => {
        console.log(text);
    })

    queue.playerMaster.on('PLAYBACK_STOPPED', () => {
    })

    queue.playerMaster.on('ERROR', (text) => {
        console.log(text);
    })

    queue.queueMaster.on('SONG_LOADING_DONE', () => {
        queue.playerMaster.start();
    })

    queue.queueMaster.on('PLAYLIST_LOADING_DONE', (playlist, author) => {
        queue.playerMaster.start();
        let addedEmbed = new MessageEmbed()
            .setColor('BLACK')
            .setTitle(`✅  ${playlist.type} successfully added!\n\n ${playlist.title ? playlist.title : playlist.name} \n`)
            .addField(`🙍‍♂️ By User:`, `\`${author}\``, true)
            .setThumbnail(playlist.thumbnail.url)
            .setURL(playlist.url)
            .setTimestamp();
        message.channel.send({ embeds: [addedEmbed] });
    })

    queue.playerMaster.on('PLAYBACK_STARTED', (queue) => {
        let song = queue.current
        let addedEmbed = new MessageEmbed()
            .setColor('BLACK')
            .setTitle(`:musical_note:  Now Playing  :musical_note:\n\n ${song.title} \n`)
            .addField(`⏱ Duration: `, `\`${song.durationRaw}\``, true)
            .addField(`🙍‍♂️ By User: `, `\`${song.author}\``, true)
            .setThumbnail(song.thumbnail)
            .setURL(song.url)
            .setTimestamp();
        if (queue.songs[0]) addedEmbed.addField(`📢 Next: `, `\`${queue.songs[0].title}\``, true);
        else { addedEmbed.addField(`📢 Next: `, "`Nothing`", true); }
        message.channel.send({ embeds: [addedEmbed] });
    })

    queue.playerMaster.on('QUEUE_ENDED', () => {
        let embed = embedGenerator.run('music.play.info_03')
        message.channel.send({
            embeds: [embed]
        })
    })
    queue.playerMaster.on('SONG_ADDED', (song) => {
        let embed = embedGenerator.run('music.play.info_05')
        embed.setDescription(`${message.author.username} ${embedGenerator.run('direct.music.play.info_02_02')} **${song.title}**`);
        embed.setURL(song.url);
        message.channel.send({
            embeds: [embed]
        })

    })

    queue.playerMaster.on('DISCONNECTED', () => {
        let embed = embedGenerator.run('music.play.info_04')
        message.channel.send({
            embeds: [embed]
        })

    })
    message.client.queue.set(message.guild.id, queue);

    // queue.playerMaster.on('PLAYER_COMMAND', (commandName, commandStatus, error) => {
    //     switch (commandName) {
    //         case 'pause': { sendPauseEmbed(commandStatus, error); break };
    //         case 'resume': { sendResumeEmbed(commandStatus, error); break };
    //         case 'stop': { sendStopEmbed(commandStatus, error); break };
    //         case 'skip': { sendSkipEmbed(commandStatus, error); break };
    //         case 'queueLoop': { sendQueueLoopEmbed(commandStatus, error); break };
    //         case 'songLoop': { sendSongLoopEmbed(commandStatus, error); break };
    //         case 'skipTo': { sendSkipToEmbed(commandStatus, error); break };
    //         case 'remove': { sendRemoveEmbed(commandStatus, error); break };
    //         default: break;
    //     }
    // })

    // async function sendPauseEmbed(commandStatus, error) {
    //     if (commandStatus == false) message.channel.send({ content: `${message.author} ${embedGenerator.run("direct.music.pause.info_02")}` });
    //     else {
    //         let embed = embedGenerator.run("music.pause.info_01");
    //         embed.setDescription(`${message.author.username} ${embed.description}`);
    //         message.channel.send({ embeds: [embed] });
    //     }
    // };

    // async function sendResumeEmbed(commandStatus, error) {
    //     if (commandStatus == false) message.channel.send({ content: `${message.author} ${embedGenerator.run("direct.music.resume.info_02")}`, })
    //     else {
    //         let embed = embedGenerator.run("music.resume.info_01");
    //         embed.setDescription(`${message.author.username} ${embed.description}`);
    //         message.channel.send({ embeds: [embed] });
    //     }
    // };

    // async function sendStopEmbed(commandStatus, error) {
    //     let embed = embedGenerator.run('music.stop.info_01');
    //     embed.setDescription(`${message.author.username} ${embed.description}`);
    //     message.channel.send({ embeds: [embed] });
    // };

    // async function sendSkipEmbed(commandStatus, error) {
    //     let embed = embedGenerator.run('music.skip.info_01');
    //     embed.setDescription(`${message.author.username} ${embed.description}`);
    //     message.channel.send({ embeds: [embed] });
    // };

    // async function sendQueueLoopEmbed(commandStatus, error) {
    //     if (error && error == 'no_args') {
    //         if (commandStatus == true) {
    //             let embed = `${embedGenerator.run("direct.music.queueLoop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
    //             message.channel.send(embed)
    //         }
    //         else {
    //             let embed = `${embedGenerator.run("direct.music.queueLoop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
    //             message.channel.send(embed);
    //         }
    //     }
    //     else if (error && error == 'incorrect_args') {
    //         let embed = embedGenerator.run("warnings.error_04");
    //         embed.setDescription(`${embed.description} queueLoop **on**/**off**`);
    //         message.channel.send({ embeds: [embed] });
    //     }
    //     else if (commandStatus == true) {
    //         let embed = `${embedGenerator.run("direct.music.queueLoop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
    //         message.channel.send(embed)
    //     }
    //     else if (commandStatus == false) {
    //         let embed = `${embedGenerator.run("direct.music.queueLoop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
    //         message.channel.send(embed);
    //     }
    // };

    // async function sendSongLoopEmbed(commandStatus, error) {
    //     if (error && error == 'no_args') {
    //         if (commandStatus == true) {
    //             let embed = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
    //             message.channel.send(embed)
    //         }
    //         else {
    //             let embed = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
    //             message.channel.send(embed);
    //         }
    //     }
    //     else if (error && error == 'incorrect_args') {
    //         let embed = embedGenerator.run("warnings.error_04");
    //         embed.setDescription(`${embed.description} loop **on**/**off**`);
    //         message.channel.send({ embeds: [embed] });
    //     }
    //     else if (commandStatus == true) {
    //         let embed = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_02")}`;
    //         message.channel.send(embed);
    //     }
    //     else if (commandStatus == false) {
    //         let embed = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
    //         message.channel.send(embed);
    //     }
    // };

    // async function sendSkipToEmbed(commandStatus, error) {
    //     if (error && error == 'no_args') {
    //     }
    //     else if (error && error == 'overrunning') {
    //         let embed = embedGenerator.run("warnings.error_04");
    //         embed.setDescription(`${embed.description} OOOOOOOOHHH OVERRUNNING`);
    //         message.channel.send({ embeds: [embed] });
    //     }
    //     else if (commandStatus == true) {
    //         let embed = embedGenerator.run("music.skip.info_01");
    //         embed.setDescription(`${message.author.username} ${embed.description}`);
    //         message.channel.send({ embeds: [embed] });
    //     }
    // };

    // async function sendRemoveEmbed(commandStatus, error) {
    //     if (error && error == 'no_args') {
    //         let embed4 = `${embedGenerator.run("direct.music.loop.info_01")} ${embedGenerator.run("direct.music.loop.info_03")}`;
    //         message.channel.send(embed4);
    //     }
    //     if (error && error == 'overrunning') {
    //         let embed = embedGenerator.run("warnings.error_04");
    //         embed.setDescription(`${embed.description} OOOOOOOOHHH OVERRUNNING`);
    //         message.channel.send({ embeds: [embed] });
    //     }
    //     if (commandStatus !== false) {
    //         message.channel.send({ content: `${message.author} ${embedGenerator.run('direct.music.remove.info_03')} **${commandStatus[0].title}** ${embedGenerator.run('direct.music.remove.info_04')}` });
    //     }
    // };
}
async function executeEngine(client, message, args, options) {
    const queue = client.queue.get(message.guild.id);
    queue.playerMaster.message = message;
    if (options == 'auto') {
        queue.queueMaster.execute(args, 'resolveAllAuto');
    } else if (options == 'playlist_auto') {
        queue.queueMaster.execute(args, 'resolvePlaylistAuto');
    }
}