const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Continues playing the current playback
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
  let guild = data.guild;
  let message = data?.message;
  let queue = data.guild.queue;
  let embed

  guild.playerManager.resume()
  if (queue.status == "paused") embed = embedGenerator.run("music.resume.info_01");
  else embed = embedGenerator.run("music.resume.info_02")

  return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('resume')
data.setDescription('Continues playing the track')
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;