const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js")
const MessageEmbed = Discord.MessageEmbed
const text = require("../data/text_packs/en.json")
/**
 * Constructs a stylized message to send
 *
 * @param {string} path The path to the message in a json file which is characterized by a string where each element of the path is separated by a dot. When specifying the identifier "direct" at the beginning of the path string, the discord message will not be constructed and will simply return the value of the json file field that we accessed as a string
 * @param {object} params Additional parameters
 * @param {string} params.url Sets the url value for the embed and takes precedence over the data from the file
 * @param {string} params.color Sets the color value for the embed and takes precedence over the data from the file
 * @param {string} params.author Sets the author value for the embed and takes precedence over the data from the file
 * @param {string} params.description Sets the description value for the embed and takes precedence over the data from the file
 * @param {string} params.title Sets the title value for the embed and takes precedence over the data from the file
 * @param {string} params.thumbnail Sets the thumbnail url for the embed and takes precedence over the data from the file
 * @param {string} params.image Sets the image url for the embed and takes precedence over the data from the file
 * @param {string} params.fields Sets the fields for the embed and takes precedence over the data from the file
 * @param {object} params.add Parameter field for changing additional parameters of message lines
 * @param {string} params.add.description Value of additional information to the description line. After specifying this parameter, the specified value in the add field will be added to the constructed line from the json file
 * @param {string} params.add.title Value of additional information to the title line. After specifying this parameter, the specified value in the add field will be added to the constructed line from the json file
 * @return {MessageEmbed}
 */
module.exports.run = (path, params) => {
    let pathArray = []
    pathArray = path.split('.');
    if (pathArray[0] == "direct") {
        return search();
    } else {
        let data = search();
        let embedMessage = new EmbedBuilder();
        embedMessage.setTitle(params?.title || ((data?.embedTitle?.toString() || '') + (params?.add?.title?.toString() || '')) || null)
        embedMessage.setDescription(params?.description || ((data?.embedDescription?.toString() || '') + (params?.add?.description?.toString() || '')) || null)
        embedMessage.setColor(params?.color || data?.embedColor || null)
        embedMessage.setURL(params?.url || data?.embedUrl || null)
        embedMessage.setAuthor(params?.author || null);
        embedMessage.setThumbnail(params?.thumbnail || data?.thumbnail || null);
        embedMessage.setImage(params?.image || data?.image || null);
        if (params?.fields || data?.fields) embedMessage.addFields(params?.fields || data?.fields || null)
        return embedMessage;
    }

    function search() {
        let el_keys;
        let el_values;
        let current_opened_el = text;
        for (let adress_index = 0; adress_index < pathArray.length; adress_index++) {
            el_keys = Object.keys(current_opened_el)
            el_values = Object.values(current_opened_el)
            for (let el_index = 0; el_index < el_keys.length; el_index++) {
                if (el_keys[el_index] == pathArray[adress_index]) {
                    current_opened_el = el_values[el_index];
                    break;
                }
            }
        }
        return current_opened_el;
    }
}