const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require('../../utils/embedGenerator')

/**
 * Enables or disables repetition
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 * @param {boolean} data.forceSend This parameter enables the forced sending of a message to the channel (initially, after execution, the command returns the data to be sent, which contains the message object to be sent). After enabling this parameter, the command will return the data to be sent and will also send this message itself.
 * @param {boolean} data.toggleMode This parameter is responsible for activating the switching mode. So if the current value is true, then the opposite will be set to it. No arguments required
 */
module.exports.run = async (data) => {
  let message = data.message;
  let args = data.args;
  let guild = data.guild;
  let channel = data?.message?.channel || data.channel;
  let embed;

  if (args == 'off' || args == 'false') {
    guild.queue.current.loop = false;
    embed = embedGenerator.run("music.loop.info_02");
  }

  else if (args == 'on' || args == 'true') {
    guild.queue.current.loop = true;
    embed = embedGenerator.run("music.loop.info_01");
  }

  else if (!args) {
    if (guild.queue.current.loop == false) embed = embedGenerator.run("music.loop.info_02");
    else embed = embedGenerator.run("music.loop.info_01");
    return { sendData: { embeds: [embed], params: { replyTo: message } }, result: false }
  }

  else embed = embedGenerator.run("music.loop.error_01");

  if (data?.forceSend == true) guild.embedManager.send({ embeds: [embed] }, { channel: channel })

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