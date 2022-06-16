const embedGenerator = require("../../utils/embedGenerator")
module.exports.run = async (client, message, args) => {
    try {
        if (!args) {
            let embed = await embedGenerator.run('info.prefix.error_02');
            message.channel.send({ embeds: [embed] }).catch(() => { })
        }
        if (args?.length > 10) {
            let embed = await embedGenerator.run('info.prefix.error_01');
            message.channel.send({ embeds: [embed] }).catch(() => { })
        }
        else {
            let params = client.guildParams.get(message.guild.id) || {};
            params.prefix = args;
            client.guildParams.set(message.guild.id, params);
            let embed = await embedGenerator.run('info.prefix.info_01');
            embed.setTitle(`${embed.title} ${args}`);
            message.channel.send({ embeds: [embed] }).catch(() => { })
        }
    } catch (err) { console.log(err) }
};

module.exports.config = {
    name: "prefix",
    cooldown: 3,
    aliases: [],
    description: "Changes the prefix of the bot to activate the command",
    category: "admin",
    accesTest: "none"
};
