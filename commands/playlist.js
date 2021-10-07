const { queue } = require("../include/queue");
const { play } = require("../include/play");
const YouTubeAPI = require("simple-youtube-api");
const Discord = require("discord.js");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, MAX_PLAYLIST_SIZE, DEFAULT_VOLUME} = require("../util/EvobotUtil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const embedGenerator = require("../include/embedGenerator");

module.exports.run = async (bot,message,args)=>{


  let embed1 = await embedGenerator.run('music.play.error_02');
  let embed2 = await embedGenerator.run('music.play.error_01');
  let embed3 = await embedGenerator.run('music.play.error_03');
  let embed4 = await embedGenerator.run('music.play.error_04');
  let embed5 = await embedGenerator.run('music.play.error_05');
  let embed6 = await embedGenerator.run('music.play.error_06');
  let embed7 = await embedGenerator.run('music.play.info_01');
  embed7.setDescription(embed7.description + ` **Playlist "args"**`);

    const { channel } = message.member.voice;
    const serverQueue = message.client.queue.get(message.guild.id);

    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply({embeds: [embed2]}).catch(console.error);

    if (!args.length)
      return message
        .reply({embeds: [embed7]})
        .catch(console.error);
    if (!channel) return message.reply({embeds: [embed1]}).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply({embeds: [embed3]});
    if (!permissions.has("SPEAK"))
      return message.reply({embeds: [embed4]});

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
      volume: DEFAULT_VOLUME || 50,
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
        return message.reply({embeds: [embed5]}).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 30, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply({content: `${error.message}`}).catch(console.error);
      }
    }

    const newSongs = videos.map((video) => {
      return (song = {
        url: video.url,
        author: message.author
      });
    });

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);
    const songs = serverQueue ? serverQueue.songs : queueConstruct.songs;

    

    

    message.channel.send({content: `${message.author} Заказал плейлист`});
    

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
        return message.channel.send({embeds:[embed2]}).catch(console.error);
      }
    }
    //queue(bot,message,args);
  };
  module.exports.config = {
    name: "playlist",
    description: "plays a playlist",
    usage: "~playlist",
    accessableby: "Members",
    aliases: ['pl'],
    category: "music"
}
