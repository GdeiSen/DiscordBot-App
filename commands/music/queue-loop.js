const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Option to enable queue repetition
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {boolean} data.toggleMode This parameter is responsible for activating the switching mode. So if the current value is true, then the opposite will be set to it. No arguments required
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
  let message = data.message;
  let args = data.args;
  let guild = data.guild;
  let embed;

  if (!args) {
    if (guild.queue.loop == false) {
      embed = embedGenerator.run("music.queueLoop.info_02");
    }
    else {
      embed = embedGenerator.run("music.queueLoop.info_01");
    }
  }

  else if (args == 'off' || args == 'false') {
    guild.queue.loop = false;
    embed = embedGenerator.run("music.queueLoop.info_02");
    guild.playerManager.emit('QUEUE_LOOP_DISABLED');
  }

  else if (args == 'on' || args == 'true') {
    guild.queue.loop = true;
    embed = embedGenerator.run("music.queueLoop.info_01");
    guild.playerManager.emit('QUEUE_LOOP_ENABLED');
  }

  else {
    embed = embedGenerator.run("music.queueLoop.error_01");
  }

  if (data?.toggleMode == true) {
    if (guild.queue.loop == false) {
      guild.queue.loop = true;
      embed = embedGenerator.run("music.queueLoop.info_01");
      guild.playerManager.emit('QUEUE_LOOP_ENABLED');
    }
    else {
      guild.queue.loop = false;
      embed = embedGenerator.run("music.queueLoop.info_02");
      guild.playerManager.emit('QUEUE_LOOP_DISABLED');
    }
  }

  if (guild.queue.current) guild.queue.current.loop = false;

  return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('queue-loop')
data.addBooleanOption(option =>
  option.setName('state')
    .setDescription('QueueLoop state')
    .setRequired(true))
data.setDescription('Option to enable queue repetition')
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;