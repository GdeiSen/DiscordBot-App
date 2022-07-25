const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Removes a track from the queue
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = (data) => {
  let args = data.args;
  let guild = data.guild;
  let message = data.message;
  let embed;
  args = Number(args);

  if (!args || args > guild.queue.songs.length || typeof args !== "number") embed = embedGenerator.run("music.remove.error_01")
  else {
    let song = guild.queue.songs.splice(args - 1, 1);
    embed = embedGenerator.run("music.remove.info_01")
  }

  return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('remove')
data.addIntegerOption(option =>
  option.setName('number')
    .setDescription('Track number to remove')
    .setRequired(true))
data.setDescription('Removes a track from the queue')
data.setMiddleware([]);
data.setCategory('music')
module.exports.data = data;