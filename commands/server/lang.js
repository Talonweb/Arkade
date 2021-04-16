const Discord = require('discord.js');
const config = require("../../config.json");
const lang = require('../../lang.json');
const BotUtils = require('../../botUtils.js');
const db = require('quick.db');

module.exports = {
    commands: ['lang', 'setlang', 'language'],
    expectedArgs: '<fr/en>',
    permissionError: config.messages.permissionsMissing,
    minArgs: 1,
    maxArgs: 1,
    cooldown: 20,
    permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    callback: (bot, message, args, text) => {
        let guild = message.guild;
        let guildPrefix = db.get(`${guild.id}.prefix`);
        let guildLang = db.get(`${guild.id}.lang`).toLowerCase();

        let newLang = args[0].toLowerCase();
        if(newLang === guildLang) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_LANG_ERROR_TITLE", guild), BotUtils.getLangKey("CMD_LANG_ERROR_ALREADY", guild))
        if(!lang.langs.includes(newLang)) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_LANG_ERROR_TITLE", guild), BotUtils.getLangKey("CMD_LANG_ERROR_INCORRECT", guild))

        db.set(`${guild.id}.lang`, newLang);

        let updateEmbed = new Discord.MessageEmbed()
            .setTitle(BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild))
            .setDescription(BotUtils.getLangKey("CMD_LANG_SUCCESS", guild) + "**" + BotUtils.getLangKey("LANGNAME", guild) + "** !")
            .setFooter(bot.user.username + config.footers.primary)
            .setColor(config.colors.success)
        message.channel.send(updateEmbed);
        return;
    },
};