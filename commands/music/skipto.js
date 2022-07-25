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
  let message = data?.message;
  let embed;

  if (args > guild.queue.songs.length || !args || args == 0) {
    embed = embedGenerator.run('music.skipto.error_01');
  }

  else {
    embed = embedGenerator.run('music.skipto.info_01');
    if (guild.queue.loop == true) {
      for (let i = 0; i < args - 1; i++) {
        guild.queue.songs.push(guild.queue.songs.shift());
      }
    } else { guild.queue.songs = guild.queue.songs.slice(args - 1); }
    guild.queueManager.setNextCurrentSong();
    guild.queue.status = 'pending';
    guild.queue.isSkipped = true;
    guild.playerManager.player.stop();
    guild.playerManager.startPlayback();
  }

  return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('skipto')
data.setDescription('Skips tracks')
data.addIntegerOption(option =>
  option.setName('skipto')
    .setDescription('Skip to')
    .setRequired(true))
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;