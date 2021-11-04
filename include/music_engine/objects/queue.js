class queue {
    guild
    channel
    voiceChannel
    songs = []
    current
    isPlaying = false
    isPaused = false
    isStoppped = false
    connection
    player
    status
    config = {
        loop: false,
        volume: 50,
        stayPermission: "default",
        maxSize: "default"
    }
}
exports.queue_ = queue;