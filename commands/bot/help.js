const Discord = require('discord.js');
const config = require("../../config.json");
const db = require('quick.db');
const BotUtils = require('../../botUtils');

module.exports = {
    commands: ['help', 'h', 'aide', 'cmds', 'cmd'],
    expectedArgs: '',
    permissionError: config.messages.permissionsMissing,
    minArgs: 0,
    cooldown: 3,
    callback: (bot, message, args, text) =>
    {
        let guild = message.guild;
        let guildPrefix = db.get(`${guild.id}.prefix`);

        let helpEmbed = new Discord.MessageEmbed()
            .setTitle("📚 " + BotUtils.getLangKey("HELP_TITLE", guild) + " " + bot.user.username)
            .setDescription(`${BotUtils.getLangKey("HELP_DESCRIPTION", guild)} \n
            ${BotUtils.getLangKey("HELP_PREFIXHERE", guild)} **${guildPrefix}**`)
            .setColor(config.colors.primary)
            .addField(`🧾 ${BotUtils.getLangKey("HELP_CAT_COUNTERS", guild)}`,
                `\`${guildPrefix}counter add members|voice|online|roles|goal\` ${BotUtils.getLangKey("HELP_CMD_CADD", guild)}` +
                `\n\`${guildPrefix}counter remove members|voice|online|roles|goal\` ${BotUtils.getLangKey("HELP_CMD_CREM", guild)}` +
                `\n\`${guildPrefix}counter format members|voice|online|roles|goal ${BotUtils.getLangKey("HELP_CMD_FORMAT_ARG", guild)}\` ${BotUtils.getLangKey("HELP_CMD_CFOR", guild)}` +
                `\n\`${guildPrefix}goal ${BotUtils.getLangKey("HELP_CMD_GOAL_ARG", guild)}\` ${BotUtils.getLangKey("HELP_CMD_GOAL", guild)}`
            )
            .addField(`🔧 ${BotUtils.getLangKey("HELP_CAT_SETTINGS", guild)}`,
                `\`${guildPrefix}settings prefix ${BotUtils.getLangKey("HELP_CMD_PREFIX_ARG", guild)}\` ${BotUtils.getLangKey("HELP_CMD_SPREFIX", guild)}` +
                `\n\`${guildPrefix}lang <en/fr>\` ${BotUtils.getLangKey("HELP_CMD_LANG", guild)}`
            )
            .addField(`🤖 ${BotUtils.getLangKey("HELP_CAT_BOT", guild)}`,
                `\`${guildPrefix}links\` ${BotUtils.getLangKey("HELP_CMD_LINKS", guild)}` +
                `\n\`${guildPrefix}ping\` ${BotUtils.getLangKey("HELP_CMD_PING", guild)}`
            )
            .setFooter(bot.user.username + config.footers.primary)
        message.channel.send(helpEmbed);
    },
};