const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require('../../utils/embedGenerator')

/**
 * Enables or disables repetition
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
  let queue = data.queue;
  let message = data.message;
  let args = data.args;
  let embed;

  if (!args) {
    if (queue.current.loop == false) embed = embedGenerator.run("music.loop.info_02");
    else embed = embedGenerator.run("music.loop.info_01");
    return { sendData: { embeds: [embed], params: { replyTo: message } }, result: false }
  }

  else if (args == 'off' || args == 'false') {
    message.guild.playerManager.songLoop(false);
    embed = embedGenerator.run("music.loop.info_02");
  }

  else if (args == 'on' || args == 'true') {
    message.guild.playerManager.songLoop(true);
    embed = embedGenerator.run("music.loop.info_01");
  }

  else embed = embedGenerator.run("music.loop.error_01")
  
  return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};
const data = new CommandBuilder()
data.setName('loop')
data.addBooleanOption(option =>
  option.setName('state')
    .setDescription('The name of the song to search for the text')
    .setRequired(true))
data.setDescription('Option to enable track repetition')
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data