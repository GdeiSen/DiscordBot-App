const embedGenerator = require("../../utils/embedGenerator")
module.exports.run = async (client, message, _args) => {
    try {
        let args = Number(_args);
        if (!args || typeof args !== "number") {
            let embed = await embedGenerator.run('info.maxPlaybackDuration.error_03');
            message.channel.send({ embeds: [embed] }).catch(() => { })
            return 0;
        }
        if (args > 9000000) {
            let embed = await embedGenerator.run('info.maxPlaybackDuration.error_01');
            message.channel.send({ embeds: [embed] }).catch(() => { })
            return 0;
        }
        if (args <= 5000) {
            let embed = await embedGenerator.run('info.maxPlaybackDuration.error_02');
            message.channel.send({ embeds: [embed] }).catch(() => { });
            return 0;
        }
        else {
            let params = client.guildParams.get(message.guild.id) || {};
            params.maxPlaybackDuration = args;
            client.guildParams.set(message.guild.id, params);
            let embed = await embedGenerator.run('info.maxPlaybackDuration.info_01');
            embed.setTitle(`${embed.title} ${args}`);
            message.channel.send({ embeds: [embed] }).catch(() => { })
        }
    } catch (err) { console.log(err) }
};

module.exports.config = {
    name: "maxPlaybackDuration",
    cooldown: 3,
    aliases: [],
    description: "Changes max playlist size",
    category: "admin",
    accesTest: "none"
};
