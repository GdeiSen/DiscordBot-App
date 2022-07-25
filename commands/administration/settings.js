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
    let embed = embedGenerator.run('info.settings.info_01');

    embed
        .addField(`${embedGenerator.run('direct.info.settings.embedTimeout_info')}`, `${guild.params?.embedTimeout?.toString() || "undefined"} ms`, true)
        .addField(`${embedGenerator.run('direct.info.settings.voteToSkip_info')}`, `${guild.params?.voteToSkip?.toString() || "false"}`, true)
        .addField(`${embedGenerator.run('direct.info.settings.stayTimeout_info')}`, `${guild.params?.stayTimeout?.toString() || "undefined"} ms`, true)
        .addField(`${embedGenerator.run('direct.info.settings.maxQueueSize_info')}`, `${guild.params?.maxQueueSize?.toString() || "undefined"}`, true)
        .addField(`${embedGenerator.run('direct.info.settings.maxPlaylistSize_info')}`, `${guild.params?.maxPlaylistSize?.toString() || "undefined"}`, true)
        .addField(`${embedGenerator.run('direct.info.settings.maxPrevQueueSize_info')}`, `${guild.params?.maxPrevQueueSize?.toString() || "undefined"}`, true)
        .addField(`${embedGenerator.run('direct.info.settings.maxPlaybackDuration_info')}`, `${guild.params?.maxPlaybackDuration?.toString() || "undefined"} ms`, true)
        .addField(`${embedGenerator.run('direct.info.settings.autoPlayerSend_info')}`, `${guild.params?.playerAutoSend?.toString() || "undefined"}`, true)
        .addField(`${embedGenerator.run('direct.info.settings.autoContinue_info')}`, `${guild.params?.autoContinue?.toString() || "undefined"}`, true)
        .addField(`${embedGenerator.run('direct.info.settings.autoPlay_info')}`, `${guild.params?.autoPlay?.toString() || "undefined"}`, true)

    return { sendData: { embeds: [embed], params: { replyTo: message, embedTimeout: 'none' } }, result: true }
};


const data = new CommandBuilder()
data.setName('settings')
data.setDescription('Shows a navigation panel to manage the bot settings')
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;