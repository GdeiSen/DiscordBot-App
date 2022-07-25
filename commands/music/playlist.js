const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")
const add = require('./add');
const startPlayback = require('./start-playback');

/**
 * Searches for and adds a playlist to the queue for playback using YouTube services
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
  let guild = data.guild;
  let embed;

  const promise = new Promise(async (resolve, reject) => {
    if (!queue) return false;
    let search = await message.guild.queryResolver.search(args, { searchType: 'playlist' }).catch((error) => {
      embed = embedGenerator.run("music.play.error_05");
      reject({ sendData: { embeds: [embed], params: { replyTo: message } }, result: false, error: error });
    });
    resolve(await add.run({ args: search.yt_playlist.url, guild: data.guild, message: data.message }))
    if (guild.params.autoPlay == true) startPlayback.run(data)
  })
  return promise;
};

const data = new CommandBuilder()
data.setName('playlist')
data.addStringOption(option =>
  option.setName('search')
    .setDescription('Playlist name')
    .setRequired(true))
data.setDescription('Starts playlist playback')
data.setMiddleware([]);
data.setCategory('music')
module.exports.data = data;