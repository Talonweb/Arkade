const BotUtils = require('../botUtils');
const config = require('../config.json');
const db = require('quick.db');

const validatePermissions = (permissions) => {
    const validPermissions = [
      'CREATE_INSTANT_INVITE',
      'KICK_MEMBERS',
      'BAN_MEMBERS',
      'ADMINISTRATOR',
      'MANAGE_CHANNELS',
      'MANAGE_GUILD',
      'ADD_REACTIONS',
      'VIEW_AUDIT_LOG',
      'PRIORITY_SPEAKER',
      'STREAM',
      'VIEW_CHANNEL',
      'SEND_MESSAGES',
      'SEND_TTS_MESSAGES',
      'MANAGE_MESSAGES',
      'EMBED_LINKS',
      'ATTACH_FILES',
      'READ_MESSAGE_HISTORY',
      'MENTION_EVERYONE',
      'USE_EXTERNAL_EMOJIS',
      'VIEW_GUILD_INSIGHTS',
      'CONNECT',
      'SPEAK',
      'MUTE_MEMBERS',
      'DEAFEN_MEMBERS',
      'MOVE_MEMBERS',
      'USE_VAD',
      'CHANGE_NICKNAME',
      'MANAGE_NICKNAMES',
      'MANAGE_ROLES',
      'MANAGE_WEBHOOKS',
      'MANAGE_EMOJIS',
    ]

    for(const permission of permissions){
        if(!validPermissions.includes(permission)){
            throw new Error(`Unknown permission node "${permission}"`);
        }
    }
}

let recentlyRan = []; // guildId-userId-command

module.exports = (bot, commandOptions) =>
{
    let {
        commands,
        expectedArgs = '',
        permissionError = config.messages.permissionsMissing,
        minArgs = 0,
        maxArgs = null,
        cooldown = -1,
        permissions = [],
        requiredRoles  = [],
        callback
    } = commandOptions

    if(typeof commands === 'string'){
        commands = [commands];
    }

    console.log(`Registering command ${commands[0]}...`);

    if(permissions.length){
        if(typeof permissions === 'string'){
            permissions = [permissions];
        }

        validatePermissions(permissions);
    }

    bot.on('message', message => {
    	if(message.guild == null) return;
    	if(message.author.bot == null) return;
        const { member, content, guild } = message;

        let prefix = db.get(`${message.guild.id}.prefix`);

        for(const alias of commands){
            if(content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`))
            {
                // A commande has been ran 


                for(const permission of permissions){
                    if(!member.hasPermission(permission)){
                        message.channel.send(permissionError);
                        return;
                    }
                }

                for(const requiredRole of requiredRoles){
                    const role = guild.roles.cache.find(role => role.id === requiredRole);

                    if(!role || member.roles.cache.has(role.id))
                    {
                        BotUtils.embed(`❌ ${BotUtils.getLangKey("CMD_ERROR_PERMISSIONS", guild)}`, BotUtils.getLangKey("CMD_ERROR_PERMISSIONS_ROLE", guild).replace("%role%", role.name), config.colors.error, message.channel).then(msg => {
                            setTimeout(() => {
                                if(msg != null) msg.delete();
                                if(message != null) message.delete();
                            }, 5000);
                        })
                        return;
                    }
                }

                let cooldownString = `${guild.id}-${member.user.id}-${commands[0]}`;
                if(cooldown > 0 && recentlyRan.includes(cooldownString))
                {
                    let reply = BotUtils.embed(`⏳ ${BotUtils.getLangKey("CMD_ERROR_COOLDOWN", guild)}`, BotUtils.getLangKey("CMD_ERROR_COOLDOWN_CONTENT", guild), config.colors.error, message.channel).then(msg => {
                        setTimeout(() => {
                            if(msg != null) msg.delete();
                            if(message != null) message.delete();
                        }, 3000);
                    })
                    return;
                }

                const args = content.split(/[ ]+/);
                args.shift();

                if(args.length < minArgs || (maxArgs !== null && args.length > maxArgs))
                {
                    BotUtils.embed(`❌ ${BotUtils.getLangKey("CMD_ERROR_SYNTAX", guild)}`, `${BotUtils.getLangKey("CMD_ERROR_SYNTAX_CONTENT", guild)} **${prefix}${alias} ${expectedArgs}**`, config.colors.error, message.channel).then(msg => {
                        setTimeout(() => {
                            if(msg != null) msg.delete();
                            if(message != null) message.delete();
                        }, 5000);
                    })
                    message.reply();
                    return;
                }

                if(cooldown > 0){
                    recentlyRan.push(cooldownString);
                    setTimeout(() =>
                    {
                        recentlyRan = recentlyRan.filter((string) => {
                            return string !== cooldownString
                        });
                    }, 1000 * cooldown)
                }

                callback(bot, message, args, args.join(' '))
                return;
            }
        }
    })
}