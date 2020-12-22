const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const YouTubeAPI = require("simple-youtube-api");
const { YOUTUBE_API_KEY } = require("../util/EvobotUtil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports.run = async (bot,message,args) => {
  var embed1 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('Для начала нужно быть в голосовом канале!')
    .setColor('RED')

    var embed2 = new Discord.MessageEmbed()
    .setTitle('ошибка')
    .setDescription('коллектор сообщений уже был взаимодействован в этом каанале!')
    .setColor('RED')

    if (!args.length)
      return message
        .reply(`Использование: ${message.client.prefix}${module.exports.name} <Video Name>`)
        .catch(console.error);
    if (message.channel.activeCollector)
      return message.reply(embed2);
    if (!message.member.voice.channel)
      return message.reply(embed1).catch(console.error);

    const search = args;

    let resultsEmbed = new MessageEmbed()
      .setTitle(`введите номер трека для проигрывания`)
      .setDescription(`Results for: ${search}`)
      .setColor("GREEN");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

      let resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
        return pattern.test(msg.content);
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      const reply = response.first().content;

      if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());

        for (let song of songs) {
          await message.client.commands
            .get("play")
            .run(bot, message, [resultsEmbed.fields[parseInt(song) - 1].name]);
        }
      } else {
        const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
        message.client.commands.get("play").run(bot, message, [choice]);
      }

      message.channel.activeCollector = false;
      resultsMessage.delete().catch(console.error);
      response.first().delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
      message.reply(error.message).catch(console.error);
    }
  };
  module.exports.config = {
    name: "search",
    description: "выполняет поиск трека и проигрывает его",
    usage: "~search",
    accessableby: "Members",
    aliases: ['s']
}