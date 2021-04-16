const Discord = require('discord.js');
const config = require("../../config.json");
const BotUtils = require('../../botUtils.js');
const db = require('quick.db');

module.exports = {
    commands: ['settings', 'setting', 'config', 'configs'],
    expectedArgs: '<setting> <value>',
    permissionError: config.messages.permissionsMissing,
    minArgs: 2,
    maxArgs: 2,
    permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    callback: (bot, message, args, text) => {
        let guild = message.guild;
        let guildPrefix = db.get(`${guild.id}.prefix`);
        
        let settingName = args[0].toLowerCase();

        if(settingName == "prefix")
        {
            if(!args[1]) return errorEmbed(bot, message, BotUtils.getLangKey("CMD_ERROR_ARGS_MISSING", guild), BotUtils.getLangKey("CMD_SETTINGS_PREFIX_ERROR_ARGS", guild));

            let newPrefix = args[1];
            if(newPrefix == guildPrefix) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_SETTINGS_PREFIX_ERROR_PREFIX_TITLE", guild), BotUtils.getLangKey("CMD_SETTINGS_PREFIX_ERROR_PREFIX_ALREADY", guild))
            if(newPrefix.length > 6) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_SETTINGS_PREFIX_ERROR_PREFIX_TITLE", guild), BotUtils.getLangKey("CMD_SETTINGS_PREFIX_ERROR_PREFIX_TOOLONG", guild))
            if(newPrefix == "null" || newPrefix == "" || newPrefix == "²") return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_SETTINGS_PREFIX_ERROR_PREFIX_TITLE", guild), BotUtils.getLangKey("CMD_SETTINGS_PREFIX_ERROR_PREFIX_NO", guild));

            let updateEmbed = new Discord.MessageEmbed()
                .setTitle(BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild))
                .setDescription(BotUtils.getLangKey("CMD_SETTINGS_PREFIX_SUCCESS", guild) + newPrefix + "** !")
                .setFooter(bot.user.username + config.footers.primary)
                .setColor(config.colors.success)
            message.channel.send(updateEmbed);

            db.set(`${guild.id}.prefix`, newPrefix);
            return;
        }
    },
};