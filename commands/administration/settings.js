const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");
const embedGenerator = require("../../include/utils/embedGenerator")
const prefixCommand = require("./prefix.js");
const embedTimeoutCommand = require("./embedTimeout.js");
const stayTimeoutCommand = require("./stayTimeout.js")
module.exports.run = async (client, message, args) => {
    try {
        if (message.channel?.activeCollector) message.channel.activeCollector.stop();
        let filter = item => item.customId === "down" || item.customId === "up" || item.customId === "select" || item.customId === "close";
        let collector = message.channel.createMessageComponentCollector({ filter, time: 300000, });
        message.channel.activeCollector = collector;
        let row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("down")
                .setEmoji("🔽")
                .setLabel("down")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("select")
                .setEmoji("⏺️")
                .setLabel("select")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("up")
                .setLabel("up")
                .setEmoji("🔼")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("close")
                .setLabel("close")
                .setEmoji("⏹️")
                .setStyle("DANGER"),
        );
        let index = 0;
        let embed = createEmbed(client, message.guild.id, index);
        let embedMessage = await message.channel.send({
            embeds: [embed], components: [row],
        });
        message.channel.activeOptionsEmbed = embedMessage;
        let guildParams = client.guildParams.get(message.guild.id) || {};
        try {
            collector.on("collect", async (item) => {
                if (item?.customId === "down") {
                    if (index < 9) index++
                    if (index == 9) index = 0;
                    embed = createEmbed(client, message.guild.id, index, guildParams);
                    embedMessage.edit({ embeds: [embed] }).catch((err) => { });
                } else if (item?.customId === "up") {
                    if (index > -1) index--
                    if (index == -1) index = 8;
                    embed = createEmbed(client, message.guild.id, index, guildParams);
                    embedMessage.edit({ embeds: [embed] }).catch((err) => { });
                } else if (item?.customId === "close") {
                    embedMessage.delete().catch((err) => { });
                } else if (item?.customId === "select") {
                    switch (index) {
                        case 0: {
                            if (message.channel?.activeCollector) message.channel.activeCollector.stop();
                            let infoEmbed = embedGenerator.run("info.settings.prefix_info");
                            let infoMessage = await message.channel.send({ embeds: [infoEmbed] });
                            let collector = message.channel.createMessageCollector({ time: 300000 });
                            message.channel.activeCollector = collector;
                            collector.on("collect", async (item) => {
                                item.delete().catch(() => { });
                                infoMessage.delete().catch(() => { });
                                prefixCommand.run(client, message, item.content)
                                collector.stop();
                                embedMessage.delete().catch(() => { });
                                this.run(client, message, args)
                            });
                            break
                        }
                        case 1: { guildParams.liveTimestamp ??= false; guildParams.liveTimestamp = !guildParams?.liveTimestamp; break; }
                        case 2: {
                            if (message.channel?.activeCollector) message.channel.activeCollector.stop();
                            let infoEmbed = embedGenerator.run("info.settings.embedTimeout_info");
                            let infoMessage = await message.channel.send({ embeds: [infoEmbed] });
                            let collector = message.channel.createMessageCollector({ time: 300000 });
                            message.channel.activeCollector = collector;
                            collector.on("collect", async (item) => {
                                item.delete().catch(() => { });
                                infoMessage.delete().catch(() => { });
                                embedTimeoutCommand.run(client, message, item.content)
                                collector.stop();
                                embedMessage.delete().catch(() => { });
                                this.run(client, message, args)
                            });
                            break
                        }
                        case 3: { guildParams.voteToSkip ??= false; guildParams.voteToSkip = !guildParams.voteToSkip; break; }
                        case 4: {
                            if (message.channel?.activeCollector) message.channel.activeCollector.stop();
                            let infoEmbed = embedGenerator.run("info.settings.stayTimeout_info");
                            let infoMessage = await message.channel.send({ embeds: [infoEmbed] });
                            let collector = message.channel.createMessageCollector({ time: 300000 });
                            message.channel.activeCollector = collector;
                            collector.on("collect", async (item) => {
                                item.delete().catch(() => { });
                                infoMessage.delete().catch(() => { });
                                stayTimeoutCommand.run(client, message, item.content)
                                collector.stop();
                                embedMessage.delete().catch(() => { });
                                this.run(client, message, args)
                            });
                            break;
                        };
                        default: break;
                    }
                    client.guildParams.set(message.guild.id, guildParams);
                }
                item.deferUpdate();
                embed = createEmbed(client, message.guild.id, index);
                embedMessage.edit({ embeds: [embed], }).catch((err) => { });
            })
        } catch (err) { console.log(err) }
        collector.on("end", async (i) => {
            embedMessage.edit({
                components: [],
            }).catch((err) => { });
        });
    } catch (err) { console.log(err) }
};

function createEmbed(client, id, active) {
    let guildParams = client.guildParams.get(id) || {};
    let embed = new MessageEmbed()
        .setColor("BLACK")
        .setTitle(`🔧   Current Server Settings\n`)
        .addField(active == 0 ? "`>⚙️ CUSTOM BOT PREFIX<`" : "⚙️ custom bot prefix", guildParams?.prefix?.toString() || "none")
        .addField(active == 1 ? "`>⚙️ ENABLE LIVE DURATION<`" : "⚙️ enable live timestamp", guildParams?.liveTimestamp?.toString() || "false")
        .addField(active == 2 ? "`>⚙️ SONGS EMBED TIMEOUT<`" : "⚙️ songs embed timeout", guildParams?.embedTimeout || "undefined")
        .addField(active == 3 ? "`>⚙️ ENABLE VOTE TO SKIP<`" : "⚙️ enable vote to skip", guildParams?.voteToSkip?.toString() || "false")
        .addField(active == 4 ? "`>⚙️ STAY BOT TIMEOUT<`" : "⚙️ stay bot timeout", guildParams?.stayTimeout || "undefined")
        .addField(active == 5 ? "`>⚙️ MAX QUEUE SIZE<`" : "⚙️ max queue size", guildParams?.stayTimeout || "undefined")
        .addField(active == 6 ? "`>⚙️ MAX PLAYLIST SIZE<`" : "⚙️ max playlist size", guildParams?.stayTimeout || "undefined")
        .addField(active == 7 ? "`>⚙️ MAX PREV QUEUE SIZE<`" : "⚙️ max prev queue size", guildParams?.stayTimeout || "undefined")
        .addField(active == 8 ? "`>⚙️ MAX PLAYBACK DURATION<`" : "⚙️ max playback duration", guildParams?.stayTimeout || "undefined")
        .setDescription("Use buttons below to navigate in menu")
    return embed;
}


module.exports.config = {
    name: "settings",
    cooldown: 3,
    aliases: ["set"],
    description: "Changes server bot settings",
    category: "admin",
    accesTest: "none"
};
