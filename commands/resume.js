const embedGenerator = require("../include/utils/embedGenerator")
const { accesTester } = require("../include/utils/accesTester.js");
module.exports.run = async(client, message, args)=>{
  {
    const tester = new accesTester(message, args);
    await tester.testPlayCommandAudioAccesPack().then(
      async (result) => {
        let queue = client.queue.get(message.guild.id);
        if(queue.status === 'playing'){message.channel.send({content: `${message.author} ${embedGenerator.run('direct.music.resume.info_02')}`}).catch(console.error);}
        else{let embed = embedGenerator.run('music.resume.info_01');
        embed.setDescription(`${message.author.username} ${embed.description}`);
        message.channel.send({embeds:[embed]})}
        queue.status = 'playing';
        queue.player.unpause();
        queue.player.emit('UNPAUSED');
      },
      (error) => {message.channel.send({ embeds: [error] }); return 0});
    }
  }
  
module.exports.config = {
  name: "resume",
  description: "Continues playing the track",
  usage: "~resume",
  accessableby: "Members",
  aliases: ['res'],
  category: "music"
}


