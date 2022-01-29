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
    if (song.totalPausedTime) { current = ((new Date().getTime() - song.startTime) / 1000) - (song.totalPausedTime / 1000) } else current = (new Date().getTime() - song.startTime) / 1000;
    nowPlaying
      .setDescription(`${song.title}\n${song.url}`)
      .setAuthor(message.client.user.username)
      .setThumbnail(song.thumbnail)
    if (queue.status == 'playing') nowPlaying.addField(`[${progressbar.splitBar(total, current, 20)[0]}]`, `Next: ${next}`, true);
    else nowPlaying.addField(`Paused!`, `Next: ${next}`, true);
    return message.channel.send({ embeds: [nowPlaying] });
  } catch (err) { console.log('[ERROR] [NP] Module error'); console.log(err) }
};

module.exports.config = {
  name: "nowplaying",
  description: "displays the current playback",
  usage: "~nowplaying",
  accessableby: "Members",
  aliases: ['now', 'n', 'np', 'playing'],
  category: "music",
  accesTest: "music-command"
}