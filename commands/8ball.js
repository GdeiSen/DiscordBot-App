
const embedGenerator = require("../include/embedGenerator")

module.exports.run = async(bot,message, args) => {
    var arggs = args;
    let random = Math.floor(Math.random() * 20) + 1;
    if (random === 1) {
        var messagec = text.entertainmet.ball.info_01;
    } 
    else if (random === 20) {
        var messagec = text.entertainmet.ball.info_02;
    }
    else if (random === 2) {
        var messagec = text.entertainmet.ball.info_03;
    }
    else if (random === 19) {
        var messagec = text.entertainmet.ball.info_04;
        }
    else if (random === 3) {
        var messagec = text.entertainmet.ball.info_05;
        }
    else if (random === 18) {
        var messagec = text.entertainmet.ball.info_06;
        }
    else if (random === 4) {
        var messagec = text.entertainmet.ball.info_07;
        }
    else if (random === 17) {
        var messagec = text.entertainmet.ball.info_08;
        }
    else if (random === 5) {
        var messagec = text.entertainmet.ball.info_09;
        }
    else if (random === 16) {
        var messagec = text.entertainmet.ball.info_10;
        }
    else if (random === 6) {
        var messagec = text.entertainmet.ball.info_11;
        }
    else if (random === 15) {
        var messagec = text.entertainmet.ball.info_12;
        }
    else if (random === 7) {
        var messagec = text.entertainmet.ball.info_13;
        }
    else if (random === 14) {
        var messagec = text.entertainmet.ball.info_14;
        }
    else if (random === 8) {
        var messagec = text.entertainmet.ball.info_15;
        }
    else if (random === 13) {
        var messagec = text.entertainmet.ball.info_16;
        }
    else if (random === 9) {
        var messagec = text.entertainmet.ball.info_17;
        }
    else if (random === 12) {
        var messagec = text.entertainmet.ball.info_1;
        }
    else if (random === 10) {
        var messagec = text.entertainmet.ball.info_5;
        }
    else if (random === 11) {
        var messagec = text.entertainmet.ball.info_9;
        }
    let embed = await embedGenerator.run('entertainmet.ball.embed');
    embed.setDescription(`${arggs}? **${messagec}**`);
    message.channel.send({embeds:[embed]})
}


module.exports.config = {
    name: "8ball",
    usage: "~8ball",
    description: "Deduces your verdict of fate",
    accessableby: "Members",
    aliases: ['8', '8b', 'b'],
    category: "entertainment"
}