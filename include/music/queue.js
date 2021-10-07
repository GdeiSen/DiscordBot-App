class queue {
    guild
    channel
    songs = []
    isPlaying = false
    connection = null
    config = {
        loop: false,
        volume: 50,
        stayPermission: "default",
        maxSize: "default"
    }
}
exports.queue_ = queue;