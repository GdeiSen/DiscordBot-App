const player = require('../include/music_engine/musicEngine')
const { accesTester } = require("../include/utils/accesTester.js");
module.exports.run = async (client,message,args)=>{
  const tester = new accesTester(message, args);
  await tester.testPlayAudioAccesPack().then(
  async (result) => {player.run(client,message,args,'playlist_auto')},
  (error) => {message.channel.send({ embeds: [error] }); return 0});
};
  module.exports.config = {
    name: "playlist",
    description: "plays a playlist",
    usage: "~playlist",
    accessableby: "Members",
    aliases: ['pl'],
    category: "music"
}
