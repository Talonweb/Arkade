const Discord = require('discord.js');
const config = require("../../config.json");
const db = require('quick.db');

module.exports = {
    commands: ['ping', 'lag'],
    expectedArgs: '',
    permissionError: config.messages.permissionsMissing,
    minArgs: 0,
    cooldown: 60,
    callback: (bot, message, args, text) =>
    {
        let guild = message.guild;

        let pingEmbed = new Discord.MessageEmbed()
            .setTitle(`📈 ${BotUtils.getLangKey("CMD_PING_TITLE", guild)}`)
            .setColor(config.colors.primary)
            .setFooter(bot.user.username + config.footers.primary)
            .setDescription(`
            • ${BotUtils.getLangKey("CMD_PING_BOT", guild)} : **${message.createdTimestamp - message.createdTimestamp}ms** ! \n
            • ${BotUtils.getLangKey("CMD_PING_API", guild)} : **${Math.round(bot.ws.ping)}ms**`)
        message.channel.send(pingEmbed);
    },
};