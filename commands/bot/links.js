const Discord = require('discord.js');
const config = require("../../config.json");
const db = require('quick.db');
const BotUtils = require('../../botUtils');

module.exports = {
    commands: ['links', 'invite'],
    expectedArgs: '',
    permissionError: config.messages.permissionsMissing,
    minArgs: 0,
    cooldown: 3,
    callback: (bot, message, args, text) =>
    {
        let guild = message.guild;
        let guildPrefix = db.get(`${guild.id}.prefix`);

        let inviteEmbed = new Discord.MessageEmbed()
            .setTitle("🔗 " + BotUtils.getLangKey("CMD_LINKS_TITLE", guild))
            .setColor(config.colors.primary)
            .setFooter(bot.user.username + config.footers.primary)
            .setDescription(`[🚀 ${BotUtils.getLangKey("CMD_LINKS_INVITE", guild)}](${config.links.inviteLink}) \n
            [🤝 ${BotUtils.getLangKey("CMD_LINKS_SUPPORTSERVER", guild)}](${config.links.supportServer})`)
        message.channel.send(inviteEmbed);
    },
};