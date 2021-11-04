"use strict";

var Discord = require("discord.js");

var text = require("../../text_packs/en.json");

module.exports.run = function (embedId) {
  var adressArray = [];
  adressArray = embedId.split('.');
  var jsonArray = [];

  for (var index in text) {
    var buffer = text[index];
    jsonArray.push(index, buffer);
  }

  if (adressArray[0] == "direct") {
    var el_names;
    var el_values;
    var current_opened_el = text;

    for (var adress_index = 1; adress_index < adressArray.length; adress_index++) {
      el_names = Object.keys(current_opened_el);
      el_values = Object.values(current_opened_el);

      for (var el_index = 0; el_index < el_names.length; el_index++) {
        if (el_names[el_index] == adressArray[adress_index]) {
          current_opened_el = el_values[el_index];
          break;
        }
      }
    }

    var value = String;
    value = current_opened_el;
    return value;
  } else {
    var search = function search(adressArray) {
      var el_names;
      var el_values;
      var current_opened_el = text;

      for (var _adress_index = 0; _adress_index < adressArray.length; _adress_index++) {
        el_names = Object.keys(current_opened_el);
        el_values = Object.values(current_opened_el);

        for (var _el_index = 0; _el_index < el_names.length; _el_index++) {
          if (el_names[_el_index] == adressArray[_adress_index]) {
            current_opened_el = el_values[_el_index];
            break;
          }
        }
      }

      return current_opened_el;
    };

    var title = adressArray.slice();
    var desc = adressArray.slice();
    var color = adressArray.slice();
    title.push('embedTitle');
    desc.push('embedDescription');
    color.push('embedColor');
    var embedMessage = new Discord.MessageEmbed().setTitle(search(title)).setDescription(search(desc)).setColor(search(color));
    return embedMessage;
  }
};