module.exports.run = async (client, message, args) => {
    let queue = client.queue.get(message.guild.id);
    queue.playerManager.prev();
    queue.embedManager.sendPrevEmbed(message.channel, { embedTimeout: queue.config.embedTimeout })
};

module.exports.config = {
    name: "previous",
    description: "Skips a track to previous one",
    usage: "bav!previous",
    accessableby: "Members",
    aliases: ["prev"],
    category: "music",
    accesTest: "music-command"
};

