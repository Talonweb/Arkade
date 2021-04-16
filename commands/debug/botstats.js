const Discord = require('discord.js');
const config = require("../../config.json");
const BotUtils = require('../../botUtils.js');
const db = require('quick.db');

module.exports = {
    commands: ['botstats'],
    expectedArgs: '',
    permissionError: config.messages.permissionsMissing,
    minArgs: 0,
    permissions: ['ADMINISTRATOR'],
    callback: (bot, message, args, text) =>
    {
        let guild = message.guild;

        if(message.author.id != config.owner) return BotUtils.errorEmbed(bot, message, "Commande réservée", "Cette commande est réservée aux membres de l'administration Arkade.");

        let membersTotal = 0;

        bot.guilds.cache.forEach((guild) => {
            membersTotal += guild.members.cache.size;
        });

        let baseDesc = `• Serveurs totaux : **${bot.guilds.cache.size} serveurs** ! \n • Membres totaux : **${membersTotal}** \n • Ping de l'API : **${Math.round(bot.ws.ping)}ms** \n • Serveurs du bot : \n`;

        bot.guilds.cache.forEach((guild) => {
            baseDesc += `\n**${guild.name}** : ${guild.members.cache.size} membres`;
        });

        let pingEmbed = new Discord.MessageEmbed()
            .setTitle("📈 Statistiques du bot")
            .setColor(config.colors.primary)
            .setFooter(bot.user.username + config.footers.primary)
            .setDescription(baseDesc)
        message.channel.send(pingEmbed);
    },
};