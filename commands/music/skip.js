const skipTo = require('./skipto')
const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Skips tracks
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
  let args = data.args;
  let guild = data.guild;
  let message = data.message;
  let embed;

  if (!args && guild.queue.songs.length !== 0) {
    if (guild.queue.status == 'paused') guild.playerManager.player.resume();
    guild.queueManager.setNextCurrentSong();
    guild.queue.status = 'pending';
    guild.queue.isSkipped = true;
    await guild.playerManager.player.stop();
    guild.playerManager.startPlayback();
    embed = embedGenerator.run('music.skipto.info_01')
  }

  else if (guild.queue.songs.length == 0) {
    embed = embedGenerator.run('music.skip.error_01');
  }

  else if (args > guild.queue.songs.length) {
    embed = embedGenerator.run('music.skipto.error_01');
  }

  else if (args) {
    skipTo.run(data);
    embed = embedGenerator.run('music.skipto.info_01');
  }

  return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('skip')
data.setDescription('Skips tracks')
data.addStringOption(option =>
  option.setName('skipto')
    .setDescription('Skip to')
    .setRequired(false))
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;