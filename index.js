const {Client,Collection,Intents} = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const config = require("./config.json");
const fs = require("fs");
client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();
client.login(config.TOKEN);
client.prefix = config.PREFIX;
client.queue = new Map();
const text = require("./text_packs/en.json")
const { MessageEmbed } = require("discord.js");


client.once("ready", () => {
  console.log(`⬜ Main Base Is Enable`);
  client.user.setActivity(`In Development!`, {
    type: "LISTENING"
  });
});

client.on("warn", (info) => console.log(info));
client.on("error", console.error);

fs.readdir("./commands/", (err, files) => {
  console.log('(command scan started)')
  if (err) console.log(err)
  let jsfile = files.filter(f => f.split(".").pop() === "js")

  if (jsfile.length <= 0) {
    return console.log("⬜ Unable To Find Commands");
  }
  jsfile.forEach((f, i) => {
    let pull = require(`./commands/${f}`);
    client.commands.set(pull.config.name, pull);
    pull.config.aliases.forEach(alias => {
      client.aliases.set(alias, pull.config.name)
    });
    let buf = new Array();
    let index = 0;
    client.commands.forEach(element => {
        if(index == 0) { buf[0] = element.config.category; index++ }
        else { if(!buf.find(el => el == element.config.category)) { buf.push(element.config.category); index++ }
      }
    })
    client.categories = buf;
  });
  console.log('(command scan finished)')
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.author.bot || message.channel.type === "dm") return;

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = message.content.split(' ').slice(1).join( );
  if (!message.content.startsWith(client.prefix)) return;


  let commandfile = client.commands.get(cmd.slice(client.prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(client.prefix.length)))
  try {
    if (commandfile && require("./include/utils/idBlocker").run(message) === "admin"){commandfile.run(client, message, args)};
  } catch (error) {
    let error_text = new MessageEmbed()
      .setTitle(text.warnings.error_01.embedTitle)
      .setDescription(text.warnings.error_01.embedDescription)
      .setColor(text.warnings.error_01.embedColor)
    message.channel.send(error_text);
    console.log(error);
    return
  }
})

