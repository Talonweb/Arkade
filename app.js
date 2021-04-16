const Discord = require('discord.js');
const bot = new Discord.Client();
const BotUtils = require('./botUtils.js');

/* Librairies */

const fs = require('fs');
const path = require('path');
const db = require("quick.db");

/* References */
const config = require("./config.json");

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const dataValues =
{
    prefix: config.defaultPrefix,
    lang: "en", /* langs: fr, en */
    membersCounter: "0",
    onlineCounter: "0",
    rolesCounter: "0",
    voiceCounter: "0",
    goalCounter: "0",
    botsCounter: "0",
    channelsCounter: "0",
    goal: "0",
    membersCounterFormat: "Members : %format%",
    onlineCounterFormat: "Online : %format%",
    rolesCounterFormat: "Roles : %format%",
    voiceCounterFormat: "In voice : %format%",
    goalCounterFormat: "Goal : %format%",
    botsCounterFormat: "Bots : %format%",
    channelsCounterFormat: "Channels : %format%"
};

const activities_list =
[
    config.defaultPrefix + "help", /* Keep this one in double */
    config.defaultPrefix + "help",
    config.defaultPrefix + "invite"
];


bot.on('ready', () => {

    console.log(`Logged in as ${bot.user.tag}!...`);
    console.log(`Checking database setup for all guilds... `);
    
    checkServersData();
    console.log("Finished checking database for guilds !");

    // Handle auto-changing status
    changeStatus();
    updateCounters();
    updateCountersSecondary();

    setInterval(() => {
        changeStatus();
    }, 10000);

    setInterval(() => {
        updateCounters();
    }, 300000); /* Updates each 5 minutes */

    setInterval(() => {
        updateCounters();
    }, 300000 * 2); /* Updates each 5 minutes */

    const baseFile = 'command-base.js';
    const commandBase = require(`./commands/${baseFile}`);

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for(const file of files){
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if(stat.isDirectory())
            {
                readCommands(path.join(dir, file));
            } else if(file !== baseFile)
            {
                const options = require(path.join(__dirname, dir, file));
                commandBase(bot, options);
            }
        }
    }

    readCommands('commands');
});

function updateCountersSecondary()
{
    console.log("Updating secondary counters...");
    bot.guilds.cache.forEach((guild) =>
    {
        /* Updates the bots counter */
        if(guild.channels.cache.has(db.get(`${guild.id}.botsCounter`)))
        {
            let id = db.get(`${guild.id}.botsCounter`);
            let targetChannel = guild.channels.cache.get(id);

            let count = guild.members.cache.filter(member => member.user.bot).size;

            let newName = db.get(`${guild.id}.botsCounterFormat`).replace("%format%", count);
            
            if(targetChannel.name != newName)
            {
                try {
                    targetChannel.setName(newName, "Compteur mis à jour");
                }catch(error){
                    console.error(error);
                }
            }
        }

        /* Updates the channels counter */
        if(guild.channels.cache.has(db.get(`${guild.id}.channelsCounter`)))
        {
            let id = db.get(`${guild.id}.channelsCounter`);
            let targetChannel = guild.channels.cache.get(id);

            let count = guild.channels.cache.size;

            let newName = db.get(`${guild.id}.channelsCounterFormat`).replace("%format%", count);
            
            if(targetChannel.name != newName)
            {
                try {
                    targetChannel.setName(newName, "Compteur mis à jour");
                }catch(error){
                    console.error(error);
                }
            }
        }
    });
    console.log("Secondary counters updated successfully across " + bot.guilds.cache.size + " servers !...");
}

function updateCounters()
{
    console.log("Updating counters...");
    bot.guilds.cache.forEach((guild) =>
    {
        /* Updates the members counter */
        if(guild.channels.cache.has(db.get(`${guild.id}.membersCounter`)))
        {
            let id = db.get(`${guild.id}.membersCounter`);
            let targetChannel = guild.channels.cache.get(id);

            let newName = db.get(`${guild.id}.membersCounterFormat`).replace("%format%", guild.memberCount);
            
            if(targetChannel.name != newName)
            {
                try {
                    targetChannel.setName(newName, "Compteur mis à jour");
                }catch(error){
                    console.error(error);
                }
            }
        }

        /* Updates the voice counter */
        if(guild.channels.cache.has(db.get(`${guild.id}.voiceCounter`)))
        {
            let id = db.get(`${guild.id}.voiceCounter`);
            let targetChannel = guild.channels.cache.get(id);

            const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');
            let count = 0;
            
            for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;

            let newName = db.get(`${guild.id}.voiceCounterFormat`).replace("%format%", count);
            
            if(targetChannel.name != newName)
            {
                try {
                    targetChannel.setName(newName, "Compteur mis à jour");
                }catch(error){
                    console.error(error);
                }
            }
        }

        /* Updates the roles counter */
        if(guild.channels.cache.has(db.get(`${guild.id}.rolesCounter`)))
        {
            let id = db.get(`${guild.id}.rolesCounter`);
            let targetChannel = guild.channels.cache.get(id);

            let count = guild.roles.cache.size;

            let newName = db.get(`${guild.id}.rolesCounterFormat`).replace("%format%", count);
            
            if(targetChannel.name != newName)
            {
                try {
                    targetChannel.setName(newName, "Compteur mis à jour");
                }catch(error){
                    console.error(error);
                }
            }
        }

        /* Updates the online counter */
        if(guild.channels.cache.has(db.get(`${guild.id}.onlineCounter`)))
        {
            let id = db.get(`${guild.id}.onlineCounter`);
            let targetChannel = guild.channels.cache.get(id);

            let onlineCount = guild.members.cache.filter(m => m.presence.status === 'online').size;
            let dndCount = guild.members.cache.filter(m => m.presence.status === 'dnd').size;

            let count = onlineCount + dndCount;

            let newName = db.get(`${guild.id}.onlineCounterFormat`).replace("%format%", count);
            
            if(targetChannel.name != newName)
            {
                try {
                    targetChannel.setName(newName, "Updated counter");
                }catch(error){
                    console.error(error);
                }
            }
        }

    });
    console.log("Counters updated successfully across " + bot.guilds.cache.size + " servers !...");
}

function changeStatus()
{
    let membersTotal = 0;

    bot.guilds.cache.forEach((guild) => {
        membersTotal += guild.members.cache.size;
    });

    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
    let txt = activities_list[index] + " | 🚀 " + bot.guilds.cache.size + " servers | 👥 " + membersTotal + " members";

    bot.user.setActivity(txt, {
        type: "STREAMING",
        url: "https://www.twitch.tv/ninja"
    });
}

function checkServersData()
{
    bot.guilds.cache.forEach((guild) =>
    {
        if(!db.has(guild.id))
        {
            db.set(guild.id, { });
        }

        for(var key in dataValues) {
            var defaultValue = dataValues[key];
            /* Per-value setter to support updates */
            if(!db.has(`${guild.id}.` + key))
            {
                db.set(`${guild.id}.` + key, defaultValue);
            }
        };
    });
}

bot.on('message', message => {
    if(message.mentions.has(bot.user) && !message.content.includes('@here') && !message.content.includes('@everyone'))
    {
        let guildPrefix = db.get(`${message.guild.id}.prefix`);
        
        message.reply(BotUtils.getLangKey("HELP_PREFIXHERE", message.guild) + "`" + guildPrefix + "` !");
    }
});

bot.on('guildCreate', guild => {
    console.log("[+] " + guild.name);

    checkServersData();
});

bot.on('guildDelete', guild => {
    console.log("[-] " + guild.name);

    checkServersData();
    
    if(db.has(guild.id)){
        db.delete(guild.id);
    }
});

bot.login(config.token);