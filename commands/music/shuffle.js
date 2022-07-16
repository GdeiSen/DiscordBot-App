const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Shuffles the queue
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
  let message = data.message;
  let guild = data.guild;

  guild.queueManager.shuffle();
  let embed = embedGenerator.run('music.shuffle.info_01');

  return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('shuffle')
data.setDescription('Shuffles the queue')
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;