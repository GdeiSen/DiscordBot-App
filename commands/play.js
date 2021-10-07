const text = require("../text_packs/en.json");
const player = require("../include/music/start")
const embedGenerator = require("../include/embedGenerator.js");
const { MessageEmbed } = require("discord.js");
const { accesTester } = require("../include/accesTester.js");
module.exports.run = async (client, message, args) => {
  const tester = new accesTester(message, args);
  await tester.testAudioAcces().then(
    async (result) => {player.run(client,message,args)},
    (error) => {message.channel.send({ embeds: [error] }); return 0});

    /*const addedEmbed = new MessageEmbed()
      .setColor(text.info.embedColor)
      .setTitle(
        `:musical_note:  Now Playing  :musical_note:\n\n ${song.name} \n`
      )
      .addField(`⏱ Duration: `, `\`${song.duration}\``, true)
      .addField(`🙍‍♂️ By User: `, `\`${song.requestedBy}\``, true)
      .setThumbnail(song.thumbnail)
      .setURL(song.url)
      .setTimestamp();
    if (queue.songs[1])
      addedEmbed.addField(`📢 Next: `, `\`${queue.songs[1].title}\``, true);
    else {
      addedEmbed.addField(`📢 Next: `, "`Nothing`", true);
    }
    message.channel.send({ embeds: [addedEmbed] });*/
  };

module.exports.config = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Plays songs",
  category: "music",
};
