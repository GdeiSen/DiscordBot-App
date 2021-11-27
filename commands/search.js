const YouTubeAPI = require("simple-youtube-api");
const {YOUTUBE_API_KEY} = require("../config.json");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const embedGenerator = require("../include/utils/embedGenerator")
module.exports.run = async (bot, message, args) => {
  
  let embed1 = await embedGenerator.run('music.play.error_02');
  let embed2 = await embedGenerator.run('music.search.error_01');
  let embed3 = await embedGenerator.run('warnings.error_04');
  embed3.setDescription(embed3.description + `${message.client.prefix}${module.exports.config.name} <Video Name>`)
  if (!args.length)
    return message.send({embeds: [embed3]}).catch(console.error);
      console.log(message.channel.activeCollector);
  if (message.channel.activeCollector == true){message.send({embeds:[embed2]});return 0}
  if (!message.member.voice.channel) return message.send({embeds:[embed1]}).catch(console.error);

  const search = args;
  let resultsEmbed = await embedGenerator.run('music.search.info_02');
  resultsEmbed.setDescription(`${resultsEmbed.description} ${search}`)
  try {
    const results = await youtube.searchVideos(search, 10);
    results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

    let resultsMessage = await message.channel.send({embeds:[resultsEmbed]});
    let reply;
    function filter(msg) {
      console.log('test filter');
      const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
      return pattern.test(msg.content);
    }
    const collector = message.channel.createMessageCollector({ filter, time: 15_000, max: 1 });
    collector.on('collect',async(m) => {reply = m.content;
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
        console.log(choice);
        message.client.commands.get("play").run(bot, message, choice);
      }
      //message.channel.activeCollector = false;
      resultsMessage.delete().catch(console.error);
      m.delete().catch(console.error);
    });
    collector.on('end', () => message.channel.activeCollector = false);

  } catch (error) {
    console.error(error);
    //message.channel.activeCollector = false;
    message.send({content: `${error.message}`}).catch(console.error);
  }
};
module.exports.config = {
  name: "search",
  description: "searches for a track and plays it",
  usage: "~search",
  accessableby: "Members",
  aliases: ['s'],
  category: "music",
  accesTest: "music-player"
}