const embedGenerator = require("../include/utils/embedGenerator")
const { accesTester } = require("../include/utils/accesTester.js");
module.exports.run = async(client, message, args)=>{
{
  const tester = new accesTester(message, args);
  await tester.testPlayCommandAudioAccesPack().then(
    async (result) => {
      let queue = client.queue.get(message.guild.id);
      if(queue.status === 'paused'){message.channel.send({content: `${message.author} ${embedGenerator.run('direct.music.pause.info_02')}`}).catch(console.error);}
      else{let embed = embedGenerator.run('music.pause.info_01');
      embed.setDescription(`${message.author.username} ${embed.description}`);
      message.channel.send({embeds:[embed]})}
      queue.status = 'paused';
      queue.player.pause();
    },
    (error) => {message.channel.send({ embeds: [error] }); return 0});
  }
}
module.exports.config = {
  name: "pause",
  description: "Pauses the playback",
  usage: "~pause",
  accessableby: "Members",
  aliases: ['pa', 'pau'],
  category: "music"
}

