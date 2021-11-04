const { queueMaster } = require("./queueMaster.js");
const { MessageEmbed } = require("discord.js");
const { player } = require('./playerMaster')
const embedGenerator = require("../utils/embedGenerator")
const text = require("../../text_packs/en.json");
module.exports.run = async (client, message, args, options) => {
try{    
    const QueueMaster = new queueMaster(client, message);
    QueueMaster.createQueue();
    const queue = QueueMaster.getQueue();
    QueueMaster.addListener('INFO',(text)=>{
        console.log(text);
    })
    QueueMaster.addListener('ERROR',(text)=>{
        console.log(text);
    })
    console.log(QueueMaster.rawListeners('INFO'));
    const Player = new player(queue,message);
    Player.addListener('INFO',(text)=>{
        console.log(text);
    })
    Player.addListener('ERROR',(text)=>{
        console.log(text);
    })
    if(options == 'auto'){
        QueueMaster.resolveAuto(args);
        QueueMaster.addListener('SONG_LOADING_DONE', () => {
        Player.start();
        })
    }else if(options == 'playlist_auto'){
        QueueMaster.resolvePlaylist(args);
        QueueMaster.addListener('PLAYLIST_LOADING_DONE', (playlist,author) => {
        Player.start();
        let addedEmbed = new MessageEmbed()
            .setColor(text.info.embedColor)
            .setTitle(`✅  Playlist successfully added!\n\n ${playlist.title} \n`)
            .addField(`🙍‍♂️ By User:`,`\`${author}\``, true)
            .setThumbnail(playlist.thumbnails.default.url)
            .setURL(playlist.url)
            .setTimestamp();
            message.channel.send({embeds: [addedEmbed]});
        })
    }
    Player.addListener('PLAYBACK_STARTED', (queue) => {
        let song = queue.current
        let addedEmbed = new MessageEmbed()
            .setColor(text.info.embedColor)
            .setTitle(`:musical_note:  Now Playing  :musical_note:\n\n ${song.title} \n`)
            .addField(`⏱ Duration: `, `\`${song.duration}\``, true)
            .addField(`🙍‍♂️ By User: `, `\`${song.author}\``, true)
            .setThumbnail(song.thumbnail)
            .setURL(song.url)
            .setTimestamp();
        if (queue.songs[1])addedEmbed.addField(`📢 Next: `, `\`${queue.songs[1].title}\``, true);
        else {addedEmbed.addField(`📢 Next: `, "`Nothing`", true);}
        message.channel.send({embeds: [addedEmbed]});

    })
    
    Player.addListener('QUEUE_ENDED',()=>{
        let embed = embedGenerator.run('music.play.info_03')
        message.channel.send({
            embeds: [embed]
        })
    })
    Player.addListener('SONG_ADDED',(song)=>{
        let embed = embedGenerator.run('music.play.info_05')
        embed.setDescription(`${message.author.username} ${embedGenerator.run('direct.music.play.info_02_02')} **${song.title}**`);
        embed.setURL(song.url);
        message.channel.send({
            embeds: [embed]
        })
    })
    Player.addListener('DISCONNECTED',()=>{
        let embed = embedGenerator.run('music.play.info_04')
        message.channel.send({
            embeds: [embed]
        })
    })
}catch(err){console.log('[ERROR] [EX] Function error');console.log(err)}
}