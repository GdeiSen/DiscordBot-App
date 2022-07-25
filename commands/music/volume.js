const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require('../../utils/embedGenerator')

/**
 * Sets the volume level value
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = (data) => {
  let guild = data.guild;
  let message = data.message;
  let args = data.args;

  args = Number(args);

  if (!args || typeof Number(args) !== "number") {
    return { sendData: { embeds: [embedGenerator.run('music.volume.error_01')], params: { replyTo: message } }, result: false }
  }
  if (args > 100) {
    return { sendData: { embeds: [embedGenerator.run('music.volume.error_01')], params: { replyTo: message } }, result: false }
  }
  if (args < 0) {
    return { sendData: { embeds: [embedGenerator.run('music.volume.error_01')], params: { replyTo: message } }, result: false }
  }

  guild.params.volume = args;
  guild.playerManager.resource.volume.setVolume(args / 100);

  return { sendData: { embeds: [embedGenerator.run('music.volume.info_01', { add: { title: ` ${args}` } })], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('volume')
data.setDescription('Sets the volume level value')
data.addIntegerOption(option =>
  option.setName('volume')
    .setDescription('Volume level')
    .setRequired(true)
    .setMaxValue(100)
    .setMinValue(0))
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;