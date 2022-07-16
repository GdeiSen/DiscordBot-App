const lyricsFinder = require("lyrics-finder");
const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Displays the lyrics of the song
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
  let message = data.message;
  let args = data.args;
  let queue = data.guild.queue;
  let name;
  let lyrics = null;

  if (!queue?.current && !args) return { sendData: { embeds: [embedGenerator.run("music.lyrics.error_03")], params: { replyTo: message } }, result: false }
  else if (queue?.current && !args) {
    try {
      const title = queue.current.title;
      name = title;
      lyrics = await lyricsFinder(title);
      if (!lyrics) throw error;
    } catch (error) {
      return { sendData: { embeds: [embedGenerator.run("music.lyrics.error_02")], params: { replyTo: message } }, result: false }
    }
  }

  else if (args) {
    try {
      lyrics = await lyricsFinder(args);
      if (lyrics.length == 0) throw error;
      name = args;
    } catch (error) {
      return { sendData: { embeds: [embedGenerator.run("music.lyrics.error_01")], params: { replyTo: message } }, result: false }
    }
  }

  else {
    return { sendData: { embeds: [embedGenerator.run("music.lyrics.error_01")], params: { replyTo: message } }, result: false }
  }
  
  if (lyrics.length >= 2048) lyrics = `${lyrics.substr(0, 2045)}...`;
  return { sendData: { embeds: [embedGenerator.run("music.lyrics.info_01", { add: { description: `**${name}**\n  ${lyrics}` } })], params: { replyTo: message, embedTimeout: 'none' } }, result: true }
};

const data = new CommandBuilder()
data.setName('lyrics')
data.addStringOption(option =>
  option.setName('song')
    .setDescription('The name of the song to search for the text')
    .setRequired(false))
data.setDescription('Displays the lyrics of the song')
data.setMiddleware([]);
data.setCategory('music');
module.exports.data = data;