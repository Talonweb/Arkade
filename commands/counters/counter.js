const Discord = require('discord.js');
const config = require("../../config.json");
const BotUtils = require('../../botUtils.js');
const db = require('quick.db');

module.exports = {
    commands: ['counter', 'count', 'compteur'],
    expectedArgs: '<format|add|remove> <type> <value> [...]',
    permissionError: config.messages.permissionsMissing,
    minArgs: 2,
    cooldown: 5,
    permissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
    callback: (bot, message, args, text) =>
    {
        let guild = message.guild;
        let guildPrefix = db.get(`${guild.id}.prefix`);

        let action = args[0].toLowerCase();
        let counterName = args[1].toLowerCase();

        if(counterName != "members" && counterName != "roles" && counterName != "bots" && counterName != "channels" && counterName != "online" && counterName != "voice" && counterName != "goal") return BotUtils.errorEmbed(bot, message, "Compteur invalide", "Ce type de compteur n'existe pas ! Bien tenté ;)");

        if(action == "format")
        {
            if(args.length < 3) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_ARGS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_ARGS_CONTENT", guild) + guildPrefix + "counter format members `Members : %format%`")
        
            let formatTarget = "";
            for(const arg of args)
            {
                if(arg != args[0] && arg != args[1]){
                    formatTarget += arg + " ";
                }
            }

            if(!formatTarget.includes("%format%")){
                return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_FORMAT_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_FORMAT_CONTENT", guild))
            }

            if(counterName == "members")
            {
                db.set(`${guild.id}.membersCounterFormat`, formatTarget);
            }

            if(counterName == "voice")
            {
                db.set(`${guild.id}.voiceCounterFormat`, formatTarget);
            }

            if(counterName == "bots")
            {
                db.set(`${guild.id}.botsCounterFormat`, formatTarget);
            }

            if(counterName == "channels")
            {
                db.set(`${guild.id}.channelsCounterFormat`, formatTarget);
            }

            if(counterName == "goal")
            {
                db.set(`${guild.id}.goalCounterFormat`, formatTarget);
            }

            if(counterName == "roles")
            {
                db.set(`${guild.id}.rolesCounterFormat`, formatTarget);
            }

            if(counterName == "online")
            {
                db.set(`${guild.id}.onlineCounterFormat`, formatTarget);
            }

            return BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_SUCCESS_FORMAT_CONTENT", guild));
        }

        /* $counter delete members */
        if(action == "remove" || action == "delete")
        {
            if(counterName == "members")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.membersCounter`)))
                {
                    db.set(`${guild.id}.membersCounter`, 0);
                }
                if(db.get(`${guild.id}.membersCounter`) == 0) counterExists = false;

                if(!counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN_CONTENT", guild));
            
                let counterChannel = guild.channels.cache.get(db.get(`${guild.id}.membersCounter`));
                counterChannel.delete();
                return BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_REMOVE_SUCCESS", guild));
            }
            if(counterName == "bots")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.botsCounter`)))
                {
                    db.set(`${guild.id}.botsCounter`, 0);
                }
                if(db.get(`${guild.id}.botsCounter`) == 0) counterExists = false;

                if(!counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN_CONTENT", guild));
            
                let counterChannel = guild.channels.cache.get(db.get(`${guild.id}.botsCounter`));
                counterChannel.delete();
                return BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_REMOVE_SUCCESS", guild));
            }
            if(counterName == "channels")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.channelsCounter`)))
                {
                    db.set(`${guild.id}.channelsCounter`, 0);
                }
                if(db.get(`${guild.id}.channelsCounter`) == 0) counterExists = false;

                if(!counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN_CONTENT", guild));
            
                let counterChannel = guild.channels.cache.get(db.get(`${guild.id}.channelsCounter`));
                counterChannel.delete();
                return BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_REMOVE_SUCCESS", guild));
            }
            if(counterName == "roles")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.rolesCounter`)))
                {
                    db.set(`${guild.id}.rolesCounter`, 0);
                }
                if(db.get(`${guild.id}.rolesCounter`) == 0) counterExists = false;

                if(!counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN_CONTENT", guild));
            
                let counterChannel = guild.channels.cache.get(db.get(`${guild.id}.rolesCounter`));
                counterChannel.delete();
                return BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_REMOVE_SUCCESS", guild));
            }
            if(counterName == "voice")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.voiceCounter`)))
                {
                    db.set(`${guild.id}.voiceCounter`, 0);
                }
                if(db.get(`${guild.id}.voiceCounter`) == 0) counterExists = false;

                if(!counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN_CONTENT", guild));
            
                let counterChannel = guild.channels.cache.get(db.get(`${guild.id}.voiceCounter`));
                counterChannel.delete();
                return BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_REMOVE_SUCCESS", guild));
            }
            if(counterName == "online")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.onlineCounter`)))
                {
                    db.set(`${guild.id}.onlineCounter`, 0);
                }
                if(db.get(`${guild.id}.onlineCounter`) == 0) counterExists = false;

                if(!counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN_CONTENT", guild));
            
                let counterChannel = guild.channels.cache.get(db.get(`${guild.id}.onlineCounter`));
                counterChannel.delete();
                return BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_REMOVE_SUCCESS", guild));
            }
            if(counterName == "goal")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.goalCounter`)))
                {
                    db.set(`${guild.id}.goalCounter`, 0);
                }
                if(db.get(`${guild.id}.goalCounter`) == 0) counterExists = false;

                if(!counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_UNKNOWN_CONTENT", guild));
            
                let counterChannel = guild.channels.cache.get(db.get(`${guild.id}.goalCounter`));
                counterChannel.delete();
                return BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_REMOVE_SUCCESS", guild));
            }
        }

        if(action == "add")
        {
            if(counterName == "voice")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.voiceCounter`)))
                {
                    db.set(`${guild.id}.voiceCounter`, 0);
                }
                if(db.get(`${guild.id}.voiceCounter`) == 0) counterExists = false;
                
                if(counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS_CONTENT", guild));

                const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');
                let count = 0;
                
                for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;

                let newCounter = guild.channels.create(db.get(`${guild.id}.voiceCounterFormat`).replace("%format%", count), {
                    type: 'voice',
                    permissionsOverwrites: []
                }).then(result => {
                    db.set(`${guild.id}.voiceCounter`, result.id);
                });

                BotUtils.successEmbed(bot, message, "Compteur ajouté", "Le compteur a correctement été ajouté ! N'oubliez pas de modifier ses permissions !")
                return;
            }
            if(counterName == "roles")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.rolesCounter`)))
                {
                    db.set(`${guild.id}.rolesCounter`, 0);
                }
                if(db.get(`${guild.id}.rolesCounter`) == 0) counterExists = false;
                
                if(counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS_CONTENT", guild));
            
                let count = guild.roles.cache.size;

                let newCounter = guild.channels.create(db.get(`${guild.id}.rolesCounterFormat`).replace("%format%", count), {
                    type: 'voice',
                    permissionsOverwrites: []
                }).then(result => {
                    db.set(`${guild.id}.rolesCounter`, result.id);
                });

                BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_SUCCESS_ADDED", guild))
                return;
            }
            if(counterName == "bots")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.botsCounter`)))
                {
                    db.set(`${guild.id}.botsCounter`, 0);
                }
                if(db.get(`${guild.id}.botsCounter`) == 0) counterExists = false;
                
                if(counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS_CONTENT", guild));
            
                let count = guild.members.cache.filter(member => member.user.bot).size;  

                let newCounter = guild.channels.create(db.get(`${guild.id}.botsCounterFormat`).replace("%format%", count), {
                    type: 'voice',
                    permissionsOverwrites: []
                }).then(result => {
                    db.set(`${guild.id}.botsCounter`, result.id);
                });

                BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_SUCCESS_ADDED", guild))
                return;
            }
            if(counterName == "channels")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.channelsCounter`)))
                {
                    db.set(`${guild.id}.channelsCounter`, 0);
                }
                if(db.get(`${guild.id}.channelsCounter`) == 0) counterExists = false;
                
                if(counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS_CONTENT", guild));
            
                let count = guild.channels.cache.size;

                let newCounter = guild.channels.create(db.get(`${guild.id}.channelsCounterFormat`).replace("%format%", count), {
                    type: 'voice',
                    permissionsOverwrites: []
                }).then(result => {
                    db.set(`${guild.id}.channelsCounter`, result.id);
                });

                BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_SUCCESS_ADDED", guild))
                return;
            }
            if(counterName == "online")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.onlineCounter`)))
                {
                    db.set(`${guild.id}.onlineCounter`, 0);
                }
                if(db.get(`${guild.id}.onlineCounter`) == 0) counterExists = false;
                
                if(counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS_CONTENT", guild));
            
                let onlineCount = guild.members.cache.filter(m => m.presence.status === 'online').size;
                let dndCount = guild.members.cache.filter(m => m.presence.status === 'dnd').size;

                let count = onlineCount + dndCount;

                let newCounter = guild.channels.create(db.get(`${guild.id}.onlineCounterFormat`).replace("%format%", count), {
                    type: 'voice',
                    permissionsOverwrites: []
                }).then(result => {
                    db.set(`${guild.id}.onlineCounter`, result.id);
                });

                BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_SUCCESS_ADDED", guild))
                return;
            }
            if(counterName == "members")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.membersCounter`)))
                {
                    db.set(`${guild.id}.membersCounter`, 0);
                }
                if(db.get(`${guild.id}.membersCounter`) == 0) counterExists = false;
                
                if(counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS_CONTENT", guild));
            
                let newCounter = guild.channels.create(db.get(`${guild.id}.membersCounterFormat`).replace("%format%", guild.members.cache.size), {
                    type: 'voice',
                    permissionsOverwrites: []
                }).then(result => {
                    db.set(`${guild.id}.membersCounter`, result.id);
                });

                BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_SUCCESS_ADDED", guild))
                return;
            }

            if(counterName == "goal")
            {
                let counterExists = true;
                if(!guild.channels.cache.has(db.get(`${guild.id}.goalCounter`)))
                {
                    db.set(`${guild.id}.goalCounter`, 0);
                }
                if(db.get(`${guild.id}.goalCounter`) == 0) counterExists = false;
                
                if(counterExists) return BotUtils.errorEmbed(bot, message, BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS", guild), BotUtils.getLangKey("CMD_COUNTER_ERROR_EXISTS_CONTENT", guild));
            
                let newCounter = guild.channels.create(db.get(`${guild.id}.goalCounterFormat`).replace("%format%", db.get(`${guild.id}.goal`)), {
                    type: 'voice',
                    permissionsOverwrites: []
                }).then(result => {
                    db.set(`${guild.id}.goalCounter`, result.id);
                });

                BotUtils.successEmbed(bot, message, BotUtils.getLangKey("CMD_SUCCESS_TITLE", guild), BotUtils.getLangKey("CMD_COUNTER_SUCCESS_ADDED", guild))
                return;
            }
        }
    },
};