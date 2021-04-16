const Discord = require('discord.js');
const config = require("../../config.json");
const BotUtils = require('../../botUtils.js');
const db = require('quick.db');

const lang = require('../../lang.json');

module.exports = {
    commands: ['test'],
    expectedArgs: '',
    permissionError: config.messages.permissionsMissing,
    minArgs: 0,
    permissions: ['ADMINISTRATOR'],
    callback: (bot, message, args, text) =>
    {
        const { guild, member } = message;

        if(message.author.id !== config.owner) return BotUtils.errorEmbed(bot, message, "Commande réservée", "Cette commande est réservée aux membres de l'administration Arkade.");
        console.log(db.get(`${guild.id}`));
        message.reply(BotUtils.getLangKey("DATA_SENT", guild));
    },
};