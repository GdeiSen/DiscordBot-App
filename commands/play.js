const text = require("../text_packs/en.json");
const player = require("../include/music_engine/musicEngine")
const embedGenerator = require("../include/utils/embedGenerator")
const { accesTester } = require("../include/utils/accesTester.js");
module.exports.run = async (client, message, args) => {
  const tester = new accesTester(message, args);
  await tester.testPlayAudioAccesPack().then(
    async (result) => {player.run(client,message,args,'auto')},
    (error) => {message.channel.send({ embeds: [error] }); return 0});
  };
module.exports.config = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Plays songs",
  category: "music",
};
