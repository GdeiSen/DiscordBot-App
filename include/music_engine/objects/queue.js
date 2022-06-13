const config = require("../../../config.json")
class Queue {
    guild
    channel
    voiceChannel
    songs = []
    prevSongs = []
    current
    isPlaying = false
    isPaused = false
    isStoppped = false
    connection
    player
    status = 'pending'
    playerManager
    queueManager
    queryResolver
    config = {
        loop: false,
        volume: config.DEFAULT_VOLUME,
        stayPermission: config.STAY_TIME,
        maxSize: config.MAX_PLAYLIST_SIZE,
        embedTimeout: 4000,
        deletePlaybackEmbed: true,
    }
}
exports.Queue = Queue;