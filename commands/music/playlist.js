const player = require("../../include/music_engine/musicEngine");

module.exports.run = async (client, message, args) => {
  player.run(client, message, args, "playlist_auto");
};

module.exports.config = {
  name: "playlist",
  description: "plays a playlist",
  usage: "~playlist",
  accessableby: "Members",
  aliases: ['pl','list','plist','playl'],
  category: "music",
  accesTest: "music-player"
};
