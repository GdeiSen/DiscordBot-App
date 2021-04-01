/**
 * Module Imports
 */
const { Client, Collection } = require("discord.js");
const {TOKEN,PREFIX } = require("./util/EvobotUtil");
const Discord = require("discord.js");
const fs = require("fs");
const client = new Client({ disableMentions: "everyone" });
client.commands = new Collection();
client.aliases = new Collection();
client.login('NzgwMDA1NDU3OTkzNTMxMzky.X7oysA.Q6aDTTXWaKuGkLYjm1bXe58OjdU');
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity(`~help и ~play`, { type: "LISTENING" });
  const jointocreate = require("./jointocreate");
  jointocreate(client);
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);
client.on("messageReactionAdd",async (reaction, user)=>{
  if(reaction.message.partial) await reaction.message.fetch();
  if(reaction.partial) await reaction.fetch();
  if(user.bot) return;
  if(!reaction.message.guild) return;
  if(reaction.message.channel.id === "780086468944199709") {
      if (reaction.emoji.name === '🆗'){
          await reaction.message.guild.members.cache.get(user.id).roles.add("827289516095701033")
      }
  }
})
client.on("messageReactionRemove",async (reaction, user)=>{
  if(reaction.message.partial) await reaction.message.fetch();
  if(reaction.partial) await reaction.fetch();
  if(user.bot) return;
  if(!reaction.message.guild) return;
  if(reaction.message.channel.id === "780086468944199709") {
      if (reaction.emoji.name === '🆗'){
          await reaction.message.guild.members.cache.get(user.id).roles.remove("827289516095701033")
      }
  }
})

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err)

  let jsfile = files.filter(f => f.split(".").pop() === "js") 
  if(jsfile.length <= 0) {
       return console.log("[LOGS] Couldn't Find Commands!");
  }

  jsfile.forEach((f, i) => {
      let pull = require(`./commands/${f}`);
      client.commands.set(pull.config.name, pull);  
      pull.config.aliases.forEach(alias => {
          client.aliases.set(alias, pull.config.name)
      });
  });
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return; 
  if(message.author.bot || message.channel.type === "dm") return;

  let prefix = "~";
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = message.content.substring(message.content.indexOf(' ')+1);
  if(!message.content.startsWith(prefix)) return;

  let error_text = new Discord.MessageEmbed()
  .setTitle('Критическая ошибка')
  .setDescription('**была вызвана критическая ошибка в синтаксисе или в коде файла функции, функция не может быть вызвана до исправления неточностей в коде, свяжитесь с администратором бота**')
  .setColor('RED')

  let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
  try{
  if(commandfile) commandfile.run(client, message, args);
}
  catch(error){message.channel.send(error_text);return}
}
);
