module.exports.run = async (client, message, args) => {
    let queue = client.queue.get(message.guild.id);
    let params = client.guildParams.get(message.guild.id);
    queue.queueManager.prev();
    queue.embedManager.sendPrevEmbed(message.channel, { embedTimeout: params.embedTimeout })
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

