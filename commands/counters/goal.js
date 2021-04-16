const Discord = require('discord.js');
const config = require("../../config.json");
const BotUtils = require('../../botUtils.js');
const db = require('quick.db');

module.exports = {
    commands: ['goal', 'setgoal'],
    expectedArgs: '<goal>',
    permissionError: config.messages.permissionsMissing,
    minArgs: 1,
    maxArgs: 1,
    cooldown: 120,
    permissions: ['MANAGE_GUILD'],
    callback: (bot, message, args, text) =>
    {
        let guild = message.guild;
        let guildPrefix = db.get(`${guild.id}.prefix`);
        let goal = args[0].toLowerCase();

        if(!guild.channels.cache.has(db.get(`${guild.id}.goalCounter`))) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN_CONTENT", guild));

        if(!isNumeric(goal)) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_LANG_ERROR_TITLE", guild), BotUtils.getLangKey("CMD_ERROR_INTEGER", guild));
        if(goal == db.get(`${guild.id}.goal`)) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_LANG_ERROR_TITLE", guild), BotUtils.getLangKey("CMD_GOAL_ERROR_ALREADY", guild));
        
        db.set(`${guild.id}.goal`, goal);
        
        let id = db.get(`${guild.id}.goalCounter`);
        let goalCounter = guild.channels.cache.get(id);
        goalCounter.setName(db.get(`${guild.id}.goalCounterFormat`).replace("%format%", db.get(`${guild.id}.goal`)));
        
        return BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_GOAL_SUCESS", guild) + goal + " !");
    },
};

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) &&
           !isNaN(parseFloat(str))
  }