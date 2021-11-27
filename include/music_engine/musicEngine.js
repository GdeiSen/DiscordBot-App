const { queueMaster } = require("./queueMaster.js");
const { MessageEmbed } = require("discord.js");
const { player } = require('./playerMaster')
const embedGenerator = require("../utils/embedGenerator")
const text = require("../../text_packs/en.json");
module.exports.run = async (client, message, args, options) => {
    const QueueMaster = new queueMaster(client, message);
    const queue = QueueMaster.getQueue();
    if(!queue) createEngine(client, message);
    executeEngine(client,message,args,options);
}

async function createEngine(client, message){
    console.log('[INFO] [ME] createEngine function activated!')
    const QueueMaster = new queueMaster(client, message);
    QueueMaster.createQueue();
    const queue = QueueMaster.getQueue();
    const Player = new player(message);
    queue.playerMaster = Player;
    queue.queueMaster = QueueMaster;
    
    queue.queueMaster.on('INFO',(text)=>{
        console.log(text);
    })
    queue.queueMaster.on('ERROR',(text)=>{
        console.log(text);
    })
    queue.playerMaster.on('INFO',(text)=>{
        console.log(text);
    })
    queue.playerMaster.on('ERROR',(text)=>{
        console.log(text);
    })
    
    queue.queueMaster.on('SONG_LOADING_DONE', () => {
        queue.playerMaster.start();
    })
    queue.queueMaster.on('PLAYLIST_LOADING_DONE', (playlist,author) => {
        queue.playerMaster.start();
        let addedEmbed = new MessageEmbed()
            .setColor(text.info.embedColor)
            .setTitle(`✅  Playlist successfully added!\n\n ${playlist.title} \n`)
            .addField(`🙍‍♂️ By User:`,`\`${author}\``, true)
            .setThumbnail(playlist.thumbnails.default.url)
            .setURL(playlist.url)
            .setTimestamp();
            message.channel.send({embeds: [addedEmbed]});
    })
    queue.playerMaster.on('PLAYBACK_STARTED', (queue) => {
        let song = queue.current
        let addedEmbed = new MessageEmbed()
            .setColor(text.info.embedColor)
            .setTitle(`:musical_note:  Now Playing  :musical_note:\n\n ${song.title} \n`)
            .addField(`⏱ Duration: `, `\`${song.duration}\``, true)
            .addField(`🙍‍♂️ By User: `, `\`${song.author}\``, true)
            .setThumbnail(song.thumbnail)
            .setURL(song.url)
            .setTimestamp();
        if (queue.songs[0])addedEmbed.addField(`📢 Next: `, `\`${queue.songs[0].title}\``, true);
        else {addedEmbed.addField(`📢 Next: `, "`Nothing`", true);}
        message.channel.send({embeds: [addedEmbed]});

    })
    queue.playerMaster.on('QUEUE_ENDED',()=>{
        let embed = embedGenerator.run('music.play.info_03')
        message.channel.send({
            embeds: [embed]
        })
    })
    queue.playerMaster.on('SONG_ADDED',(song)=>{
        let embed = embedGenerator.run('music.play.info_05')
        embed.setDescription(`${message.author.username} ${embedGenerator.run('direct.music.play.info_02_02')} **${song.title}**`);
        embed.setURL(song.url);
        message.channel.send({
            embeds: [embed]
        })
    })
    queue.playerMaster.on('DISCONNECTED',()=>{
        let embed = embedGenerator.run('music.play.info_04')
        message.channel.send({
            embeds: [embed]
        })
    })
    message.client.queue.set(message.guild.id, queue);
}

async function executeEngine(client,message,args,options){
    const queue = client.queue.get(message.guild.id);
    if(options == 'auto'){
        queue.queueMaster.resolveAuto(args);
    }else if(options == 'playlist_auto'){
        queue.queueMaster.resolvePlaylist(args);
    }
}