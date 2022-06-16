const embedGenerator = require("../../utils/embedGenerator")
module.exports.run = async (client, message, _args) => {
    try {
        let args = Number(_args);
        if (!args || typeof Number(args) !== "number") {
            let embed = await embedGenerator.run('info.maxPrevQueueSize.error_03');
            message.channel.send({ embeds: [embed] }).catch(() => { })
            return 0;
        }
        if (args > 400) {
            let embed = await embedGenerator.run('info.maxPrevQueueSize.error_01');
            message.channel.send({ embeds: [embed] }).catch(() => { })
            return 0;
        }
        if (args <= 1) {
            let embed = await embedGenerator.run('info.maxPrevQueueSize.error_02');
            message.channel.send({ embeds: [embed] }).catch(() => { });
            return 0;
        }
        else {
            let params = client.guildParams.get(message.guild.id) || {};
            params.maxPrevQueueSize = args;
            client.guildParams.set(message.guild.id, params);
            let embed = await embedGenerator.run('info.maxPrevQueueSize.info_01');
            embed.setTitle(`${embed.title} ${args}`);
            message.channel.send({ embeds: [embed] }).catch(() => { })
        }
    } catch (err) { console.log(err) }
};

module.exports.config = {
    name: "maxPrevQueueSize",
    cooldown: 3,
    aliases: [],
    description: "Changes max prev queue size",
    category: "admin",
    accesTest: "none"
};
