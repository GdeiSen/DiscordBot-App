module.exports.run = async (client, message, args) => {
    let queue = await message.client.queue.get(message.guild.id);
    if (queue?.playerManager) {
        queue.playerManager.disconnect();
    }
};

module.exports.config = {
    name: "disconnect",
    cooldown: 3,
    aliases: ["dis"],
    description: "Disconnect bot from the voice channel",
    category: "music",
    accesTest: "connection-command"
};
