const { Client, Collection, Intents } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { accesTester } = require("./include/utils/accesTester");
const { ServerEngine } = require("./include/server_engine/serverConnectEngine.js");
const { DataBase } = require("./include/data_engine/SQLConnectEngine.js")
const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const text = require("./text_packs/en.json")
const config = require("./config.json");
client.dataBaseEngine = new DataBase(client);
client.serverEngine = new ServerEngine(client);
client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();
client.queue = new Map();
client.login(config.TOKEN);
client.prefix = config.PREFIX;

client.once("ready", () => {
  console.log(`⬜ Main Manager Is Enable`);
  client.user.setActivity(`BETA 2.3`, {
    type: "LISTENING"
  });
  try {
    client.dataBaseEngine.createConnection();
    client.serverEngine.createConnect();
  } catch (error) { }
});

fs.readdir("./commands/", (err, files) => {
  console.log('⬜️​ Command Scan Started')
  if (err) console.log(err)
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if (jsfile.length <= 0) {
    return console.log("🟥 Unable To Find Commands");
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
      if (index == 0) { buf[0] = element.config.category; index++ }
      else {
        if (!buf.find(el => el == element.config.category)) { buf.push(element.config.category); index++ }
      }
    })
    client.categories = buf;
  });
  console.log('⬜️ Command Scan Finished');
});

client.on('guildDelete', () => {
  client.dataBaseEngine.updateServerData();
  client.dataBaseEngine.updateUserData();
})

client.on('guildCreate', () => {
  client.dataBaseEngine.updateServerData();
  client.dataBaseEngine.updateUserData();
})

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.author.bot || message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = message.content.split(' ').slice(1).join();
  if (!message.content.startsWith(client.prefix)) return;
  let commandfile = client.commands.get(cmd.slice(client.prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(client.prefix.length)))
  try {
    const tester = new accesTester(message, args, commandfile.config.accesTest);
    tester.on('DENIED', (error) => { message.channel.send({ embeds: [error] }) })
    tester.on('GRANTED', () => { commandfile.run(client, message, args) })
    await tester.startSelector();
  } catch (error) {
    let error_text = new MessageEmbed()
      .setTitle(text.warnings.error_01.embedTitle)
      .setDescription(text.warnings.error_01.embedDescription)
      .setColor(text.warnings.error_01.embedColor)
    message.channel.send({ embeds: [error_text] });
    console.log(error);
    return
  }
})

