"use strict";

var Discord = require("discord.js");

module.exports.run = function _callee(bot, message, args) {
  var arggs, random, messagec, embed;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          arggs = args;
          random = Math.floor(Math.random() * 20) + 1;

          if (random === 1) {
            messagec = "Определенно да!";
          } else if (random === 20) {
            messagec = "Никаких сомнений";
          } else if (random === 2) {
            messagec = "Предрешено";
          } else if (random === 19) {
            messagec = "Можешь быть уверен в этом";
          } else if (random === 3) {
            messagec = "Бесспорно";
          } else if (random === 18) {
            messagec = "Мне кажется - да?";
          } else if (random === 4) {
            messagec = "Вероятнее всего";
          } else if (random === 17) {
            messagec = "Хорошие перспективы";
          } else if (random === 5) {
            messagec = "Занки говорят - да";
          } else if (random === 16) {
            messagec = "Наверное да";
          } else if (random === 6) {
            messagec = "Пока не ясно, попробуй снова";
          } else if (random === 15) {
            messagec = "Спроси позже";
          } else if (random === 7) {
            messagec = "Лучше не рассказывать";
          } else if (random === 14) {
            messagec = "Сейчас нельзя предсказать";
          } else if (random === 8) {
            messagec = "Сконцетрируйся и спроси опять";
          } else if (random === 13) {
            messagec = "Даже не думай";
          } else if (random === 9) {
            messagec = "Мой ответ - Нет";
          } else if (random === 12) {
            messagec = "По моим данным - Нет";
          } else if (random === 10) {
            messagec = "Переспективы не очень хорошие";
          } else if (random === 11) {
            messagec = "Весьма сомнительно";
          }

          embed = new Discord.MessageEmbed().setTitle("".concat(messagec)).setDescription("".concat(arggs)).setColor('PURPLE');
          message.channel.send(embed);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.config = {
  name: "8ball",
  usage: "~8ball",
  description: "Выводит твой приговор судьбы",
  accessableby: "Members",
  aliases: ['c', 'purge']
};