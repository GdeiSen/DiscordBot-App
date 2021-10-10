const { song_ } = require("./song.js")
const ytdl = require("ytdl-core");
const Youtube  = require("simple-youtube-api");
//const youtube = new Youtube(youtubeAPI);
const { queueMaster } = require("./queueConstructor.js");
class songMaster {
    constructor(client,message){
        this.client = client;
        this.serverQueueConstruct = new queueMaster(client,message);
    }
    serverQueueConstruct = new queueMaster(client,message);
    /*resolveYouTube(query){
        if (query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
            try {
              const playlist = await youtube.getPlaylist(query);
              const videosObj = await playlist.getVideos(); 
              for (let i = 0; i < videosObj.length; i++) { 
                const video = await videosObj[i].fetch();
                let song = new song_;
                song.url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                song.title = video.raw.snippet.title;
                song.duration = this.formatDuration(video.duration);
                song.thumbnail = video.thumbnails.high.url;
                if (song.duration == '00:00') song.duration = 'Live Stream';
                this.serverQueueConstruct.addSong(song);
                
              }
              if (message.guild.queue.isPlaying == false) {
                message.guild.queue.isPlaying = true;
                return this.play(message.guild.queue, message);
              } else if (message.guild.queue.isPlaying == true) {
                return message.say(
                  `Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
                );
              }
            } catch (err) {
              console.error(err);
              return message.say('Playlist is either private or it does not exist');
            }
          }
    }

    play(queue, message) {
      let voiceChannel;
      queue[0].voiceChannel//HERE need to be a chanhe to v13!!!
        .join() // join the user's voice channel
        .then(connection => {
          const dispatcher = connection
            .play(
              ytdl(queue[0].url, { // pass the url to .ytdl()
                quality: 'highestaudio',
                // download part of the song before playing it
                // helps reduces stuttering
                highWaterMark: 1024 * 1024 * 10
              })
            )
            .on('start', () => {
              // the following line is essential to other commands like skip
              message.guild.musicData.songDispatcher = dispatcher;
              dispatcher.setVolume(message.guild.musicData.volume);
              voiceChannel = queue[0].voiceChannel;
              // display the current playing song as a nice little embed
              const videoEmbed = new MessageEmbed()
                .setThumbnail(queue[0].thumbnail) // song thumbnail
                .setColor('#e9f931')
                .addField('Now Playing:', queue[0].title)
                .addField('Duration:', queue[0].duration);
              // also display next song title, if there is one in queue
              if (queue[1]) videoEmbed.addField('Next Song:', queue[1].title);
              message.say(videoEmbed); // send the embed to chat
              return queue.shift(); //  dequeue the song
            })
            .on('finish', () => { // this event fires when the song has ended
              if (queue.length >= 1) { // if there are more songs in queue
                return this.playSong(queue, message); // continue playing
              } else { // else if there are no more songs in queue
                message.guild.musicData.isPlaying = false;
                return voiceChannel.leave(); // leave the voice channel
              }
            })
            .on('error', e => {
              message.say('Cannot play song');
              message.guild.musicData.queue.length = 0;
              message.guild.musicData.isPlaying = false;
              message.guild.musicData.nowPlaying = null;
              console.error(e);
              return voiceChannel.leave();
            });
        })
        .catch(e => {
          console.error(e);
          return voiceChannel.leave();
        });
    }*/
}
exports.queueMaster = songMaster;