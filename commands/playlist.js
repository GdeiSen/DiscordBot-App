const { queue } = require("../include/queue");
const { play } = require("../include/play");
const YouTubeAPI = require("simple-youtube-api");
const Discord = require("discord.js");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, MAX_PLAYLIST_SIZE, DEFAULT_VOLUME} = require("../util/EvobotUtil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);


module.exports.run = async (bot,message,args)=>{
  var embed1 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('**Для начала нужно быть в голосовом канале!**')
    .setColor('RED')

    var embed2 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('**Вы должны быть в одинаковым канале с ботом!**')
    .setColor('RED')

    let embed3 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('**Кажется у меня недостаточно прав для присоединения к вашему каналу!**')
    .setColor('RED')

    let embed4 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('**Кажется у меня недостаточно прав для проигрывания музыки!**')
    .setColor('RED')

    let embed5 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('**К сожалению ничего не нашлось!**')
    .setColor('RED')

    let embed6 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('**Кажется что-то пошло не так!**')
    .setColor('RED')

    let embed7 = new Discord.MessageEmbed()
    .setTitle('использование')
    .setDescription(`~ play <YouTube URL | Video Name | Soundcloud URL>`)
    .setColor('ORANGE')

    const { channel } = message.member.voice;
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!args.length)
      return message
        .reply(embed7)
        .catch(console.error);
    if (!channel) return message.reply(embed1).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply(embed3);
    if (!permissions.has("SPEAK"))
      return message.reply(embed4);

    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(embed2).catch(console.error);

    const search = args;
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args;
    const urlValid = pattern.test(args);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME || 100,
      playing: true
    };

    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 30, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(embed5).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 30, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    const newSongs = videos.map((video) => {
      return (song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      });
    });

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);
    const songs = serverQueue ? serverQueue.songs : queueConstruct.songs;

    

    

    message.channel.send(`${message.author} Заказал плейлист`);
    

    if (!serverQueue) {
      message.client.queue.set(message.guild.id, queueConstruct);
    
      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message, args);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(embed2).catch(console.error);
      }
    }
    queue(bot,message,args);
  };
  module.exports.config = {
    name: "playlist",
    description: "выполняет проигрывание плейлиста",
    usage: "~playlist",
    accessableby: "Members",
    aliases: ['pl']
}
