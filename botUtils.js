const Discord = require('discord.js');
const config = require('./config.json');
const db = require('quick.db');
const lang = require('./lang.json');
const { get } = require('http');

module.exports = class BotUtils {

    static embed(title, content, color, channel)
    {
        try {
            let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(content)
            .setColor(color)
            return channel.send(embed);
        } catch(error){
            // hop veski
        }
    }

    static getLangKey(key, guild)
    {
        let guildLang = db.get(`${guild.id}.lang`);
        try {
            if(lang.translations[key][guildLang] == null || lang.translations[key][guildLang] === ""){
                return lang.missingKey;
            }
        } catch(err){
            return lang.missingKey;
        }
        return lang.translations[key][guildLang];
    }

    static successEmbed(bot, msg, title, message)
    {
        let successEmbed = new Discord.MessageEmbed()
            .setTitle("✅ " + title)
            .setDescription(message)
            .setFooter(bot.user.username + config.footers.primary)
            .setColor(config.colors.success)
        msg.channel.send(successEmbed);
    }

    static errorEmbed(bot, msg, title, message)
    {
        let errorEmbed = new Discord.MessageEmbed()
            .setTitle("❌ " + title)
            .setDescription(message)
            .setFooter(bot.user.username + config.footers.primary)
            .setColor(config.colors.error)
        msg.channel.send(errorEmbed);
    }
}