const play = require('play-dl');
const add = require('./add');
const embedGenerator = require("../../utils/embedGenerator")
const { CommandBuilder } = require('../../builders/commandDataBuilder');

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
  let channel = message.channel || data.channel;
  let content;
  let embeds = [];

  const promise = new Promise(async (resolve, reject) => {
    if (channel?.activeCollector) channel.activeCollector.stop();
    let resultsEmbed = embedGenerator.run('music.search.info_02', { add: { description: ` ${args}` } });
    let videos = await play.search(args, { source: { youtube: "video" }, limit: 10 });
    videos.map((video, index) => resultsEmbed.addField(video.url, `${index + 1}. ${video.title}`));
    let resultsMessage = await guild.embedManager.send({ embeds: [resultsEmbed] }, { replyTo: message, embedTimeout: 'none' });
    function filter(msg) { const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g; return pattern.test(msg.content); }
    let collector = channel.createMessageCollector({ filter, time: 15_000, max: 1 });
    collector.on('collect', async (item) => {
      content = item.content;
      let songs = content.split(",").map((str) => str.trim());
      for (let song of songs) {
        const choice = resultsEmbed.fields[parseInt(song) - 1].name;
        data.args = choice;
        addResult = await add.run(data);
        if (addResult?.sendData?.embeds) embeds = embeds.concat(addResult.sendData.embeds);
      }
      resolve({ sendData: { embeds: embeds, params: { replyTo: message, embedTimeout: 'none' } }, result: true });
      guild.embedManager.delete(resultsMessage);
      guild.embedManager.delete(item);
    });
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