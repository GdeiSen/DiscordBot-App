const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

module.exports.run = async (data) => {
    let message = data.message;
    let args = data.args;
    let random = Math.floor(Math.random() * 20) + 1;

    let messagec = text.entertainmet.ball[`info_${random}`];
    args = args.replace(/[?]/g, '')
    args = args.replace(/[,]/g, ' ')
    let embed = embedGenerator.run('entertainmet.ball.embed');
    embed.setDescription(`${args}? **${messagec}**`);
    return { sendData: { embeds: [embed], params: { replyTo: message, timeout: 'none' } }, result: true }
}

const data = new CommandBuilder()
data.setName('8ball')
data.addStringOption(option =>
    option.setName('question')
        .setDescription('Your question to the magic ball ')
        .setRequired(true))
data.setDescription('Deduces your verdict of fate')
data.setCategory('entertainment');
data.setMiddleware([])
module.exports.data = data;