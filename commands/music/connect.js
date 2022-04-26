module.exports.run = async (client, message, args) => {
    let queue = await message.client.queue.get(message.guild.id);
    if (queue?.playerManager) { queue.playerManager.connect(message.member.voice.channel, message.guild) }
    else { queue = client.musicPlayer.createQueue(client, message.guild); queue.playerManager.connect(message.member.voice.channel, message.guild) }
};

module.exports.config = {
    name: "connect",
    cooldown: 3,
    aliases: ["con"],
    description: "Connect bot to the voice channel",
    category: "music",
    accesTest: "connection-command"
};
