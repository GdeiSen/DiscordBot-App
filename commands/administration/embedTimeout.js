const embedGenerator = require("../../include/utils/embedGenerator")
module.exports.run = async (client, message, args) => {
    try {
        if (!args && typeof args !== "number") {
            let embed = await embedGenerator.run('info.embedTimeout.error_03');
            message.channel.send({ embeds: [embed] }).catch(() => { })
            return 0;
        }
        if (args > 10000000) {
            let embed = await embedGenerator.run('info.embedTimeout.error_01');
            message.channel.send({ embeds: [embed] }).catch(() => { })
            return 0;
        }
        if (args <= 1000) {
            let embed = await embedGenerator.run('info.embedTimeout.error_02');
            message.channel.send({ embeds: [embed] }).catch(() => { });
            return 0;
        }
        else {
            let params = client.guildParams.get(message.guild.id) || {};
            params.embedTimeout = args;
            client.guildParams.set(message.guild.id, params);
            let embed = await embedGenerator.run('info.embedTimeout.info_01');
            embed.setTitle(`${embed.title} ${args}`);
            message.channel.send({ embeds: [embed] }).catch(() => { })
        }
    } catch (err) { console.log(err) }
};

module.exports.config = {
    name: "embedTimeout",
    cooldown: 3,
    aliases: [],
    description: "Changes the embed timeout",
    category: "admin",
    accesTest: "none"
};
