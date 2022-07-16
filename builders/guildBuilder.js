const config = require("../config.json");
const { PlayerManager } = require("../managers/playerManager");
const { QueryResolver } = require("../managers/queryResolver");
const { QueueManager } = require("../managers/queueManager");
const { EmbedManager } = require("../managers/embedManager");

module.exports.GuildBuilder = class GuildBuilder {

    build(client) {
        let guilds = client.guilds.cache;
        guilds.map(guild => {
            QueueManager.createQueue(guild);
            this.createParams(guild);
            this.createManagers(client, guild);
            this.createActiveBuffers(guild);
        })
    }

    createParams(guild) {
        let guildParams = {
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
            liveTimestamp: config.LIVE_TIMESTAMP,
            playerAutoSend: config.PLAYER_AUTO_SEND,
            autoPlay: config.AUTO_PLAY,
            autoContinue: config.AUTO_CONTINUE,
            activeClean: config.ACTIVE_CLEAN,
        }
        guild.params = guildParams;
    }

    createActiveBuffers(guild) {
        guild.activeEmbeds = { playbackEmbed: null, queueEmbed: null, playerEmbed: null }
        guild.activeCollectors = { queueCollector: null, playerCollector: null }
    }

    createManagers(client, guild) {
        guild.queueManager = new QueueManager(client, guild);
        guild.playerManager = new PlayerManager(client, guild);
        guild.queryResolver = new QueryResolver(client, guild);
        guild.embedManager = new EmbedManager(client, guild);
    }

}
