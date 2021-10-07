"use strict";

var Discord = require("discord.js");

var text = require("../text_packs/en.json");

module.exports.run = function _callee(embedId) {
  var adressArray, jsonArray, index, buffer, el_names, el_values, current_opened_el, adress_index, el_index, search, title, desc, color, embedMessage;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          adressArray = [];
          adressArray = embedId.split('.');
          jsonArray = [];

          for (index in text) {
            buffer = text[index];
            jsonArray.push(index, buffer);
          }

          if (!(adressArray[0] == "direct")) {
            _context.next = 24;
            break;
          }

          current_opened_el = text;
          adress_index = 1;

        case 7:
          if (!(adress_index < adressArray.length)) {
            _context.next = 21;
            break;
          }

          el_names = Object.keys(current_opened_el);
          el_values = Object.values(current_opened_el);
          el_index = 0;

        case 11:
          if (!(el_index < el_names.length)) {
            _context.next = 18;
            break;
          }

          if (!(el_names[el_index] == adressArray[adress_index])) {
            _context.next = 15;
            break;
          }

          current_opened_el = el_values[el_index];
          return _context.abrupt("break", 18);

        case 15:
          el_index++;
          _context.next = 11;
          break;

        case 18:
          adress_index++;
          _context.next = 7;
          break;

        case 21:
          return _context.abrupt("return", current_opened_el);

        case 24:
          search = function search(adressArray) {
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

          title = adressArray.slice();
          desc = adressArray.slice();
          color = adressArray.slice();
          title.push('embedTitle');
          desc.push('embedDescription');
          color.push('embedColor');
          embedMessage = new Discord.MessageEmbed().setTitle(search(title)).setDescription(search(desc)).setColor(search(color));
          return _context.abrupt("return", embedMessage);

        case 33:
        case "end":
          return _context.stop();
      }
    }
  });
};