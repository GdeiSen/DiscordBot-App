const play = require('play-dl');
const embedGenerator = require("../../include/utils/embedGenerator")

module.exports.run = async (bot, message, args) => {
  let resultsEmbed = await embedGenerator.run('music.search.info_02');
  resultsEmbed.setDescription(`${resultsEmbed.description} ${args}`)
  try {
    const results = await play.search(args, { source: { youtube: "video" }, limit: 10 });
    results.map((video, index) => resultsEmbed.addField(video.url, `${index + 1}. ${video.title}`));
    let resultsMessage = await message.channel.send({ embeds: [resultsEmbed] });
    let reply;
    function filter(msg) { const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g; return pattern.test(msg.content); }
    const collector = message.channel.createMessageCollector({ filter, time: 15_000, max: 1 });
    collector.on('collect', async (m) => {
      reply = m.content;
      message.channel.activeCollector = true;
      if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());
        for (let song of songs) {
          await message.client.commands
            .get("play")
            .run(bot, message, resultsEmbed.fields[parseInt(song) - 1].name);
        }
      } else {
        const choice = resultsEmbed.fields[parseInt(m) - 1].name;
        message.client.commands.get("play").run(bot, message, choice);
      }
      message.channel.activeCollector = false;
      resultsMessage.delete().catch(console.error);
      m.delete().catch(console.error);
    });
    collector.on('end', () => message.channel.activeCollector = false);
  } catch (error) {
    message.channel.activeCollector = false;
    message.channel.send({ content: `${error.message}` }).catch(console.error);
  }
};

module.exports.config = {
  name: "search",
  description: "searches for a track and plays it",
  usage: "~search",
  accessableby: "Members",
  aliases: ['s','find','look'],
  category: "music",
  accesTest: "collector-player-command"
}