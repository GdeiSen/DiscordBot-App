const embedGenerator = require("../../utils/embedGenerator")
module.exports.run = async (client, message, args) => {
    try {
        if (!args || (args !== "false" && args !== "true" && args !== "off" && args !== "on")) {
            let embed = await embedGenerator.run('info.embedTimeout.error_01');
            message.channel.send({ embeds: [embed] }).catch(() => { })
            return 0;
        }
        if (args == "false" || args == "off") {
            let params = client.guildParams.get(message.guild.id) || {};
            params.liveTimestamp = false;
            client.guildParams.set(message.guild.id, params);
            let embed = await embedGenerator.run('info.liveTimestamp.info_01');
            embed.setTitle(`${embed.title} ${args}`);
            message.channel.send({ embeds: [embed] }).catch(() => { })
        }
        if (args == "true" || args == "on") {
            let params = client.guildParams.get(message.guild.id) || {};
            params.liveTimestamp = true;
            client.guildParams.set(message.guild.id, params);
            let embed = await embedGenerator.run('info.liveTimestamp.info_01');
            embed.setTitle(`${embed.title} ${args}`);
            message.channel.send({ embeds: [embed] }).catch(() => { })
        }
    } catch (err) { console.log(err) }
};

module.exports.config = {
    name: "liveTimestamp",
    cooldown: 3,
    aliases: [],
    description: "Enable or Disable live timestamps",
    category: "admin",
    accesTest: "none"
};
