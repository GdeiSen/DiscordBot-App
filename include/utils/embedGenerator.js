const Discord = require("discord.js")
const text = require("../../data/text_packs/en.json")
module.exports.run = (embedId) => {
    let adressArray = []
    adressArray = embedId.split('.');

    let jsonArray = [];
    for (let index in text) {
        let buffer = text[index];
        jsonArray.push(index, buffer)
    }

    if (adressArray[0] == "direct") {
        let el_names;
        let el_values;
        let current_opened_el = text;
        for (let adress_index = 1; adress_index < adressArray.length; adress_index++) {
            el_names = Object.keys(current_opened_el)
            el_values = Object.values(current_opened_el)
            for (let el_index = 0; el_index < el_names.length; el_index++) {

                if (el_names[el_index] == adressArray[adress_index]) {
                    current_opened_el = el_values[el_index];
                    break;
                }
            }
        }
        let value = String;
        value = current_opened_el;
        return value;

    } else {
        let title = adressArray.slice();
        let desc = adressArray.slice();
        let color = adressArray.slice();

        title.push('embedTitle')
        desc.push('embedDescription')
        color.push('embedColor')

        function search(adressArray) {
            let el_names;
            let el_values;
            let current_opened_el = text;
            for (let adress_index = 0; adress_index < adressArray.length; adress_index++) {
                el_names = Object.keys(current_opened_el)
                el_values = Object.values(current_opened_el)
                for (let el_index = 0; el_index < el_names.length; el_index++) {

                    if (el_names[el_index] == adressArray[adress_index]) {
                        current_opened_el = el_values[el_index];
                        break;
                    }
                }
            }
            return current_opened_el;
        }
        let embedMessage = new Discord.MessageEmbed()
        if(search(title)) embedMessage.setTitle(search(title))
        if(search(desc)) embedMessage.setDescription(search(desc))
        if(search(color)) embedMessage.setColor(search(color))
        return embedMessage;
    }
}