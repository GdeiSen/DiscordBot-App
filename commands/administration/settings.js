const { MessageEmbed, MessageButton } = require("discord.js");
const embedGenerator = require("../../utils/embedGenerator")
const { CommandBuilder } = require("../../builders/commandDataBuilder");

/**
 * Shows a navigation panel to manage the bot settings
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.client The current main client of this bot
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
    let message = data.message;
    let guild = data.guild;
    let embed = embedGenerator.run('info.settings.info_01', {
        fields: [
            { name: '⏱️   ***Intervals ============================***', value: 'ᅠ', inline: false },

            { name: `${embedGenerator.run('direct.info.settings.embedTimeout_info')}`, value: `[ ${guild.params?.embedTimeout?.toString() || "undefined"} ms ]`, inline: false },
            { name: `${embedGenerator.run('direct.info.settings.stayTimeout_info')}`, value: `[ ${guild.params?.stayTimeout?.toString() || "undefined"} ms ]`, inline: false },
            { name: `${embedGenerator.run('direct.info.settings.maxPlaybackDuration_info')}`, value: `[ ${guild.params?.maxPlaybackDuration?.toString() || "undefined"} ms ]`, inline: false },

            { name: 'ᅠ\n\n🕹️   ***Options ============================***', value: 'ᅠ', inline: false },

            { name: `${embedGenerator.run('direct.info.settings.voteToSkip_info')}`, value: `[ ${guild.params?.voteToSkip?.toString() || "false"} ]`, inline: false },
            { name: `${embedGenerator.run('direct.info.settings.autoPlayerSend_info')}`, value: `[ ${guild.params?.playerAutoSend?.toString() || "undefined"} ]`, inline: false },
            { name: `${embedGenerator.run('direct.info.settings.autoContinue_info')}`, value: `[ ${guild.params?.autoContinue?.toString() || "undefined"} ]`, inline: false },
            { name: `${embedGenerator.run('direct.info.settings.autoPlay_info')}`, value: `[ ${guild.params?.autoPlay?.toString() || "undefined"} ]`, inline: false },
            { name: `${embedGenerator.run('direct.info.settings.liveTimestamp_info')}`, value: `[ ${guild.params?.liveTimestamp?.toString() || "undefined"} ]`, inline: false },

            { name: 'ᅠ\n\n📢   ***Limits ============================***', value: 'ᅠ', inline: false },

            { name: `${embedGenerator.run('direct.info.settings.maxQueueSize_info')}`, value: `[ ${guild.params?.maxQueueSize?.toString() || "undefined"} ]`, inline: false },
            { name: `${embedGenerator.run('direct.info.settings.maxPlaylistSize_info')}`, value: `[ ${guild.params?.maxPlaylistSize?.toString() || "undefined"} ]`, inline: false },
            { name: `${embedGenerator.run('direct.info.settings.maxPrevQueueSize_info')}`, value: `[ ${guild.params?.maxPrevQueueSize?.toString() || "undefined"} ]`, inline: false },

        ]
    });

    return { sendData: { embeds: [embed], params: { replyTo: message, embedTimeout: 'none' } }, result: true }
};


const data = new CommandBuilder()
data.setName('settings')
data.setDescription('Shows a navigation panel to manage the bot settings')
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;