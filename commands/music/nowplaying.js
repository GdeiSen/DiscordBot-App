const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")
const progressbar = require("string-progressbar")

/**
 * Sends current playback embed
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.channel Discord text channel for specifying the way to send response messages
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
  let message = data.message;
  let queue = data.guild.queue;
  let guild = data.guild;
  let next;
  let current;
  let song = queue.current;
  let total = song.durationInSec;

  if (queue.songs[0]) { next = queue.songs[0].title } else next = 'nothing!'
  if (!song.live) current = getCurrentTimestamp(song);
  let nowPlaying = embedGenerator.run('music.nowPlaying.info_01', { description: `**${song.title || ''}**\n${song.url || ''}`, thumbnail: song?.thumbnail?.url || '' });
  if (queue.status == 'playing' && current) nowPlaying.addField(`${toHHMMSS(current)} [${progressbar.splitBar(total, current, 20)[0]}] ${toHHMMSS(song.durationInSec)}`, `Next: ${next}`, true);
  else if (queue.status == 'playing' && !current) nowPlaying.addField(`LIVE!`, `Next: ${next}`, true);
  else if (queue.status == 'paused') nowPlaying.addField(`Paused!`, `Next: ${next}`, true);
  else if (queue.status !== 'paused' && queue.status !== 'stopped') nowPlaying.addField(`Ready to start!`, `Next: Nothing!`, true);
  let activeNowPlayingEmbed = await guild.embedManager.send({ embeds: [nowPlaying] }, { replyTo: message });
  guild.activeEmbeds.nowPlayingEmbed = activeNowPlayingEmbed;
  return { result: true, activeEmbeds: { nowPlayingEmbed: activeNowPlayingEmbed } }
};

function toHHMMSS(timestamp) {
  var sec_num = parseInt(timestamp, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  if (hours == 0) { return minutes + ':' + seconds }
  else { return hours + ':' + minutes + ':' + seconds }
}

function getCurrentTimestamp(song) {
  if (song.totalPausedTime) { current = ((new Date().getTime() - song.startTime) / 1000) - (song.totalPausedTime / 1000) } else current = (new Date().getTime() - song.startTime) / 1000;
  return current;
}

const data = new CommandBuilder()
data.setName('nowplaying')
data.setDescription('Displays the current playback')
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;