const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");
const embedGenerator = require("../../utils/embedGenerator")

const prefixCommand = require("./prefix.js");
const embedTimeoutCommand = require("./embedTimeout.js");
const stayTimeoutCommand = require("./stayTimeout.js");
const maxPlaybackDurationCommand = require("./maxPlaybackDuration.js");
const maxPlaylistSizeCommand = require('./maxPlaylistSize');
const maxPrevQueueSizeCommand = require('./maxPrevQueueSize');
const maxQueueSizeCommand = require('./maxQueueSize');

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
                            let infoEmbed = embedGenerator.run("info.settings.prefix_info");
                            createCollector(infoEmbed, embedMessage, prefixCommand, this);
                            break
                        }
                        case 1: {
                            guildParams.liveTimestamp ??= false; guildParams.liveTimestamp = !guildParams?.liveTimestamp;
                            break;
                        }
                        case 2: {
                            let infoEmbed = embedGenerator.run("info.settings.embedTimeout_info");
                            createCollector(infoEmbed, embedMessage, embedTimeoutCommand, this);
                            break;
                        }
                        case 3: { guildParams.voteToSkip ??= false; guildParams.voteToSkip = !guildParams.voteToSkip; break; }
                        case 4: {
                            let infoEmbed = embedGenerator.run("info.settings.stayTimeout_info");
                            createCollector(infoEmbed, embedMessage, stayTimeoutCommand, this);
                            break;
                        };
                        case 5: {
                            let infoEmbed = embedGenerator.run("info.settings.maxQueueSize_info");
                            createCollector(infoEmbed, embedMessage, maxQueueSizeCommand, this);
                            break;
                        };
                        case 6: {
                            let infoEmbed = embedGenerator.run("info.settings.maxPlaylistSize_info");
                            createCollector(infoEmbed, embedMessage, maxPlaylistSizeCommand, this);
                            break;
                        };
                        case 7: {
                            let infoEmbed = embedGenerator.run("info.settings.maxPrevQueueSize_info");
                            createCollector(infoEmbed, embedMessage, maxPrevQueueSizeCommand, this);
                            break;
                        };
                        case 8: {
                            let infoEmbed = embedGenerator.run("info.settings.maxPlaybackDuration_info");
                            createCollector(infoEmbed, embedMessage, maxPlaybackDurationCommand, this);
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

    async function createCollector(infoEmbed, embedMessage, func, self) {
        if (message.channel?.activeCollector) message.channel.activeCollector.stop();
        let infoMessage = await message.channel.send({ embeds: [infoEmbed] });
        let collector = message.channel.createMessageCollector({ time: 300000 });
        message.channel.activeCollector = collector;
        collector.on("collect", async (item) => {
            item.delete().catch(() => { });
            infoMessage.delete().catch(() => { });
            func.run(client, message, item.content)
            collector.stop();
            embedMessage.delete().catch(() => { });
            self.run(client, message, args)
        });
    }
};

function createEmbed(client, id, active) {
    let guildParams = client.guildParams.get(id) || {};
    let embed = new MessageEmbed()
        .setColor("BLACK")
        .setTitle(`🔧   Current Server Settings\n`)
        .addField("⠀", "⠀")
        .addField(active == 0 ? "`> 🈳 CUSTOM BOT PREFIX <` \n`> or use via -> bav!prefix ...`" : "🈳 custom bot prefix", `CURRENT STATE : ${guildParams?.prefix?.toString() || "none"}`)
        .addField(active == 1 ? "`> 📶 ENABLE LIVE DURATION <`\n`> or use via -> bav!liveTimestamp ...`" : "📶 enable live timestamp", `CURRENT STATE : ${guildParams?.liveTimestamp?.toString() || "false"}`)
        .addField(active == 2 ? "`> ⌛ SONGS EMBED TIMEOUT <`\n`> or use via -> bav!embedTimeout ...`" : "⌛ songs embed timeout", `CURRENT STATE : ${guildParams?.embedTimeout?.toString() || "undefined"}`)
        .addField(active == 3 ? "`> ❌ ENABLE VOTE TO SKIP <`\n" : "❌ enable vote to skip", `CURRENT STATE : ${guildParams?.voteToSkip?.toString() || "false"}`)
        .addField(active == 4 ? "`> ⌛ STAY BOT TIMEOUT <`\n`> or use via -> bav!stayTimeout ...`" : "⌛ stay bot timeout", `CURRENT STATE : ${guildParams?.stayTimeout?.toString() || "undefined"}`)
        .addField(active == 5 ? "`> ⏱️ MAX QUEUE SIZE <`\n`> or use via -> bav!maxQueueSize ...`" : "⏱️ max queue size", `CURRENT STATE : ${guildParams?.maxQueueSize?.toString() || "undefined"}`)
        .addField(active == 6 ? "`> ⏱️ MAX PLAYLIST SIZE <`\n`> or use via -> bav!maxPlaylistSize ...`" : "⏱️ max playlist size", `CURRENT STATE : ${guildParams?.maxPlaylistSize?.toString() || "undefined"}`)
        .addField(active == 7 ? "`> ⏱️ MAX PREV QUEUE SIZE <`\n`> or use via -> bav!maxPrevQueueSize ...`" : "⏱️ max prev queue size", `CURRENT STATE : ${guildParams?.maxPrevQueueSize?.toString() || "undefined"}`)
        .addField(active == 8 ? "`> ⏱️ MAX PLAYBACK DURATION <`\n`> or use via -> bav!maxPlaybackDuration ...`" : "⏱️ max playback duration", `CURRENT STATE : ${guildParams?.maxPlaybackDuration?.toString() || "undefined"}`)
        .setDescription("use the buttons to navigate through the settings menu. When you press the center button, additional actions may be required from you, such as entering values. If navigation is very slow, refer to using a separate command")
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
