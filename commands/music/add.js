const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Searches for and adds a track to the queue for playback using Spotify and YouTube services
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.channel Discord text channel for specifying the way to send response messages
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {boolean} data.forceSend A parameter that is specified when it is necessary to send a player message by disabling all restrictions
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
    let message = data.message;
    let args = data.args;
    let guild = data.guild;
    let queue = data.guild?.queue;
    let embed;

    const promise = new Promise(async (resolve, reject) => {
        if (!queue) return false;
        let search = await guild.queryResolver.search(args, { author: `${message?.member?.user?.username || 'Someone'}` }).catch((error) => {
            if (error == 'STRICT_PLAYLIST_SIZE_MAXIMUM') resolve({ sendData: { embeds: [embedGenerator.run("warnings.playlist_limit_strict")], params: { replyTo: message } }, result: false });
            else resolve({ sendData: { embeds: [embedGenerator.run("music.play.error_05")], params: { replyTo: message } }, result: false });
        });

        let songs = search?.yt_videos || search?.sp_tracks || search?.yt_playlist.videos || search?.sp_playlist.videos;
        
        if (search?.yt_videos) {
            embed = embedGenerator.run("music.play.info_05", {
                url: search.yt_videos[0]?.url,
                thumbnail: search.yt_videos[0].thumbnail?.url || search.yt_videos[0].thumbnails[0].url,
                add: { description: `**${search.yt_videos[0].title}**` }
            });
        }

        if (search?.sp_tracks) {
            embed = embedGenerator.run("music.play.info_05", {
                url: search.sp_tracks[0]?.url,
                thumbnail: search.sp_tracks[0].thumbnail?.url || search.sp_tracks[0].thumbnails[0].url,
                add: { description: `**${search.sp_tracks[0].title}**` }
            });
        }

        if (search?.yt_playlist) {
            embed = embedGenerator.run("music.playlist.info_01",
                {
                    url: search.yt_playlist.url,
                    thumbnail: search.yt_playlist.thumbnail.url,
                    add: { description: `**${search.yt_playlist?.title || search.yt_playlist.name}**` }
                });
        }

        if (search?.sp_playlist) {
            embed = embedGenerator.run("music.playlist.info_01",
                {
                    thumbnail: search.sp_playlist.thumbnail.url,
                    url: search.sp_playlist.url,
                    add: { description: `**${search.sp_playlist?.title || search.sp_playlist.name}**` }
                });
        }

        let add = await guild.queueManager.pushSongsToQueue(songs).catch(error => {
            resolve({ sendData: { embeds: [embed, embedGenerator.run('warnings.queue_limit_strict')], params: { replyTo: message } }, result: false });
        })

        if (search?.limit_reached == true) {
            resolve({ sendData: { embeds: [embed, embedGenerator.run('warnings.playlist_limit')], params: { replyTo: message } }, result: true });
        }

        if (add?.limit_reached == true) {
            resolve({ sendData: { embeds: [embed, embedGenerator.run('warnings.queue_limit')], params: { replyTo: message } }, result: true });
        }
        
        else {
            resolve({ sendData: { embeds: [embed], params: { replyTo: message} }, result: true });
        }

    })
    return await promise;
};

const data = new CommandBuilder()
data.setName('add')
data.addStringOption(option =>
    option.setName('search')
        .setDescription('Name of the song or playlist/song url ')
        .setRequired(true))
data.setDescription('Add song to the queue')
data.setMiddleware([]);
data.setCategory('music')
module.exports.data = data;