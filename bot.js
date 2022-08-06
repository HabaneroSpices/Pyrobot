// Setup.
//

const log = require("fancy-log");
const Discord = require("discord.js");
const generateImage = require("./generateImage.js");
const packagejson = require('./package.json');
const discordConfig = require('./config/discord.json');

const client = new Discord.Client({intents: ["GUILDS","GUILD_MESSAGES","GUILD_MEMBERS"]});

const prefix = discordConfig.prefix;
const token = discordConfig.token;

// The funky stuff
//

client.once("ready", () => { // Get ready status and log it.
    //console.log(`\u{2714} ${client.user.tag} is online.`);
    // success(`${client.user.tag} version ${packagejson.version} is online.`);
    log(`${client.user.tag} version ${packagejson.version} is online.`)
});

client.once('reconnecting', () => {
    log('Reconnecting!');
});

client.once('disconnect', () => {
    log('Disconnect!');
});


// Basic bot command handling.
client.on("messageCreate", message => {
    if (message.author.bot) return; // Confirm that the message author is not a bot.
    if (!message.content.startsWith(prefix)) return; // Filter out any message that does not start with THE prefix.

    const command = {
        body: message.content.substring(),
        args: message.content.substring(prefix.length).split(' '),
        action: message.content.substring(prefix.length).split(' ').shift().toLowerCase()
    };

    switch (command.action) {
        case "ping":
            const messageDelay = Date.now() - message.createdTimestamp;
            message.reply(`\u{1F3D3} Pong! ${messageDelay}ms`);
            break;

        case "commands":
            const commandList = [
                "commands",
                "ping"
            ];
            const commandListPrefix = commandList.map(el => prefix + el).join("\n");
            //const commandListPrefix = commandList.map(el => prefix + el).join("\n"); 
            message.reply(`**${commandListPrefix}**`);
            break;

        default:
            message.reply(`Invalid command. Try ${prefix}commands`);
            return;
    }  
    log(`User ${message.author} ran ${command.action} -- ${command.body}`);
});

// Create a Welcome message with a custom image every time a new member joins the server.
client.on("guildMemberAdd", async (member) => { 
    const img = await generateImage(member)
    member.guild.channels.cache.get(discordConfig.welcome_channel_id).send({
        content: `<@${member.id}> Welcome to the server!`,
        files: [img]
    });
    //TODO Give default roles to new user.
}); 

client.login(token); // Authenticate bot with API token in ./.envs