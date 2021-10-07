//const { MessageEmbed, Message } = require("discord.js");
const config = require("../config.json");
const text = require("../text_packs/en.json");
const embedGenerator = require("../include/embedGenerator");


module.exports.run = async (client, message, args) => {
  let info_text_0 = await embedGenerator.run('info.info_02');
  let info_text_1 = await embedGenerator.run('info.info_03');
  let info_text_2 = await embedGenerator.run('info.info_04');
  let info_text_3 = await embedGenerator.run('info.info_05');
  
  message.channel.send(info_text_0)
  
  function filter(message) {
    if (!message.author.bot) return 1;
  }
  try {
    const response = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
      errors: ["time"]
    });
    const reply = response.first().content;
    if (reply == "7777") {
      let restart_message = await message.channel.send(info_text_1);
      await restart_message.react("🔁");
      var collector = restart_message.createReactionCollector(filter => {
        return 1
      }, {
        max: 1,
        time: 30000,
        errors: ["time"]
      });
      collector.on("collect", (reaction) => {
        switch (reaction.emoji.name) {
          case "🔁":
            message.channel.send("begin reloading").then(msg => {
              setTimeout(function(){
                 msg.edit("reloading is complete!");
              }, 10000);
            })
            .then(client.destroy())
            .then(client.login(config.TOKEN))
            break;
        }
      });


    } else message.channel.send(info_text_2)
  } catch (error) {
    message.channel.send(info_text_3);
    console.log(error)
  }
};

module.exports.config = {
  name: "emergency",
  description: "emergency mode for administrator",
  usage: "~emergency",
  accessableby: "Members",
  aliases: ['emerg', 'e'],
  category: "test"
}