const play = require('play-dl');
const embedGenerator = require("../../include/utils/embedGenerator")

module.exports.run = async (client, message, args) => {
  let channel = message.channel
  if (channel?.activeCollector) channel.activeCollector.stop();
  let resultsEmbed = await embedGenerator.run('music.search.info_02');
  resultsEmbed.setDescription(`${resultsEmbed.description} ${args}`)
  try {
    let content;
    const results = await play.search(args, { source: { youtube: "video" }, limit: 10 });
    results.map((video, index) => resultsEmbed.addField(video.url, `${index + 1}. ${video.title}`));
    let resultsMessage = await channel.send({ embeds: [resultsEmbed] });
    function filter(msg) { const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g; return pattern.test(msg.content); }
    const collector = channel.createMessageCollector({ filter, time: 15_000, max: 1 });
    channel.activeCollector = collector;
    collector.on('collect', async (item) => {
      content = item.content;
      if (item.content.includes(",")) {
        let songs = content.split(",").map((str) => str.trim());
        for (let song of songs) { client.musicPlayer.play(message, resultsEmbed.fields[parseInt(song) - 1].name); }
      } else {
        const choice = resultsEmbed.fields[parseInt(item) - 1].name;
        client.musicPlayer.play(message, choice);
      }

      resultsMessage.delete().catch(console.error);
      item.delete().catch(console.error);
    });
  } catch (error) {
    message.channel.send({ content: `${error.message}` }).catch(console.error);
  }
};

module.exports.config = {
  name: "search",
  description: "searches for a track and plays it",
  usage: "~search",
  accessableby: "Members",
  aliases: ['s', 'find', 'look'],
  category: "music",
  accesTest: "music-player"
}