const embedGenerator = require("../../include/utils/embedGenerator")
module.exports.run = async (bot, message, args) => {
    let embed = embedGenerator.run('entertainmet.keyboard.embed')
    embed.setDescription(changer(args.split(',').join(' ')));
    message.channel.send({ embeds: [embed] });
}

function changer(str) {
    replacer = {
        "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г",
        "i": "ш", "o": "щ", "p": "з", "[": "х", "]": "ъ", "a": "ф", "s": "ы",
        "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д",
        ";": "ж", "'": "э", "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и",
        "n": "т", "m": "ь", ",": "б", ".": "ю", "/": ".", " ": " "
    };

    for (i = 0; i < str.length; i++) {
        if (replacer[str[i].toLowerCase()] != undefined) {

            if (str[i] == str[i].toLowerCase()) {
                replace = replacer[str[i].toLowerCase()];
            } else if (str[i] == str[i].toUpperCase()) {
                replace = replacer[str[i].toLowerCase()].toUpperCase();
            }

            str = str.replace(str[i], replace);
        }
    }

    return str;
}

module.exports.config = {
    name: "keyboardChange",
    description: "Сhanges the keyboard layout from English to Russian",
    usage: "~keyboardChange",
    accessableby: "Members",
    aliases: ['kc'],
    category: "entertainment",
    accesTest: "none"
}