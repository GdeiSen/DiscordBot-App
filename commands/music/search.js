const play = require('play-dl');
const add = require('./add');
const embedGenerator = require("../../utils/embedGenerator")
const { CommandBuilder } = require('../../builders/commandDataBuilder');
const { ActionRowBuilder, SelectMenuBuilder, InteractionCollector } = require('discord.js');

/**
 * Searches for and adds a track to the queue for playback using YouTube services
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.channel Discord text channel for specifying the way to send response messages
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
  let message = data.message;
  let args = data.args;
  let guild = data.guild;

  const promise = new Promise(async (resolve, reject) => {
    try { guild.activeCollectors.searchCollector.stop() } catch (e) { }
    guild.embedManager.delete(guild.activeEmbeds.searchEmbed);
    let resultsEmbed = embedGenerator.run('music.search.info_02', { add: { description: `\`${args}\`` } });
    let videos = await play.search(args, { source: { youtube: "video" }, limit: 10 });

    if (videos.length == 0) resolve({ sendData: { embeds: [embedGenerator.run('music.play.info_06')], params: { replyTo: message } } });

    const row = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('trackSelect')
          .setPlaceholder('Tracks is not selected')
      );

    videos.map((video, index) => row.components[0].addOptions({
      label: video?.title,
      description: video?.url,
      value: video?.url,
    }))

    let searchCollector = message.channel.createMessageComponentCollector({ time: 300000 });

    searchCollector.on('collect', async interaction => {
      if (!interaction.isSelectMenu()) return;
      if (interaction.customId !== 'trackSelect') return;
      data.args = interaction.values[0];
      let commandResult = await add.run(data);
      guild.embedManager.send({ embeds: commandResult.sendData.embeds }, { replyTo: interaction })
      try { guild.activeCollectors.searchCollector.stop() } catch (e) { }
      guild.embedManager.delete(guild.activeEmbeds.searchEmbed);
    });

    let resultsMessage = await guild.embedManager.send({ embeds: [resultsEmbed], components: [row] }, { replyTo: message, embedTimeout: 'none' });

    guild.activeCollectors.searchCollector = searchCollector;
    guild.activeEmbeds.searchEmbed = resultsMessage;
  })

  return await promise
};

const data = new CommandBuilder()
data.setName('search')
data.addStringOption(option =>
  option.setName('search')
    .setDescription('Track name')
    .setRequired(true))
data.setDescription('Searches for a track and plays it')
data.setMiddleware([]);
data.setCategory('music')
module.exports.data = data;