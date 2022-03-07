const progressbar = require('string-progressbar');
const embedGenerator = require("../../include/utils/embedGenerator")

module.exports.run = async (client, message, args) => {
  try {
    let queue = await client.queue.get(message.guild.id);
    let next;
    let current;
    let song = queue.current;
    let total = song.durationInSec;
    let embed1 = await embedGenerator.run('warnings.error_03');
    let nowPlaying = await embedGenerator.run('music.nowPlaying.info_01');
    if (queue.songs[0]) { next = queue.songs[0].title } else next = 'nothing!'
    if (!queue) { return message.reply({ embeds: [embed1] }).catch(console.error); }
    if (!song.live) current = getCurrentTimestamp(song);
    nowPlaying
      .setDescription(`**${song.title}**\n${song.url}`)
      .setAuthor(message.client.user.username)
      .setThumbnail(song.thumbnail)
    if (queue.status == 'playing' && current) nowPlaying.addField(`${toHHMMSS(current)}[${progressbar.splitBar(total, current, 20)[0]}]${toHHMMSS(song.durationInSec)}`, `Next: ${next}`, true);
    else if (queue.status == 'playing' && !current) nowPlaying.addField(`LIVE!`, `Next: ${next}`, true);
    else if (queue.status !== 'playing') nowPlaying.addField(`Paused!`, `Next: ${next}`, true);
    return message.channel.send({ embeds: [nowPlaying] });
  } catch (err) { console.log('[ERROR] [NP] Module error'); console.log(err) }
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

module.exports.config = {
  name: "nowplaying",
  description: "displays the current playback",
  usage: "~nowplaying",
  accessableby: "Members",
  aliases: ['now', 'n', 'np', 'playing'],
  category: "music",
  accesTest: "music-command"
}