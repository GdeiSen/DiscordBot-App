const embedGenerator = require("../../include/utils/embedGenerator")
module.exports.run = async (client, message, args) => {
    try {
        if (!args && typeof args !== "number") {
            let embed = await embedGenerator.run('info.stayTimeout.error_03');
            message.channel.send({ embeds: [embed] }).catch(() => { })
            return 0;
        }
        if (args > 10000000) {
            let embed = await embedGenerator.run('info.stayTimeout.error_01');
            message.channel.send({ embeds: [embed] }).catch(() => { })
            return 0;
        }
        if (args <= 1000) {
            let embed = await embedGenerator.run('info.stayTimeout.error_02');
            message.channel.send({ embeds: [embed] }).catch(() => { });
            return 0;
        }
        else {
            let params = client.guildParams.get(message.guild.id) || {};
            params.stayTimeout = args;
            client.guildParams.set(message.guild.id, params);
            let embed = await embedGenerator.run('info.stayTimeout.info_01');
            embed.setTitle(`${embed.title} ${args}`);
            message.channel.send({ embeds: [embed] }).catch(() => { })
        }
    } catch (err) { console.log(err) }
};

module.exports.config = {
    name: "stayTimeout",
    cooldown: 3,
    aliases: [],
    description: "Changes the stay timeout",
    category: "admin",
    accesTest: "none"
};
