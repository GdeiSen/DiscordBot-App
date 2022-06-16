const config = require("../config.json")

module.exports.syncParams = (client) => {

}

module.exports.createParams = async (client) => {
    let guilds = await client.guilds.fetch();
    guilds.map(guild => {
        let guildParams = client.guildParams.get(guild.id);
        if (guildParams) return 0;
        guildParams = {
            stayTimeout: config.STAY_TIMEOUT,
            prefix: config.PREFIX,
            volume: config.VOLUME,
            autoPlay: config.AUTOPLAY,
            embedTimeout: config.EMBED_TIMEOUT,
            voteToSkip: config.VOTE_TO_SKIP,
            maxPlaylistSize: config.MAX_PLAYLIST_SIZE,
            maxPlaybackDuration: config.MAX_PLAYBACK_DURATION,
            maxQueueSize: config.MAX_QUEUE_SIZE,
            maxPrevQueueSize: config.MAX_PREV_QUEUE_SIZE,
            strictLimits: config.STRICT_LIMITS,
        }
        client.guildParams.set(guild.id, guildParams);
    })
}