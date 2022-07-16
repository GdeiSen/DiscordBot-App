const { CommandBuilder } = require("../../builders/commandDataBuilder");
const add = require('./add')
const startPlayback = require('./start-playback')

/**
 * Searches for and adds a track to the queue for playback using Spotify and YouTube services
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.channel Discord text channel for specifying the way to send response messages
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
  let addData = await add.run(data).catch(error => { return 0 })
  startPlayback.run(data)
  return addData;
};

const data = new CommandBuilder()
data.setName('play')
data.addStringOption(option =>
  option.setName('search')
    .setDescription('Name of the song or playlist/song url ')
    .setRequired(true))
data.setDescription('Starts playback of the current queue')
data.setMiddleware(["testUserId", "testSameUserBotLocation", "testUserVoiceChannelAvailability", "testAudioPermissions", "testArgs"]);
data.setCategory('music')
module.exports.data = data;