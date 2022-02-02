require("dotenv").config();
const Discord = require("discord.js");

const generateImage = require("./generateImage.js");

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
});
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;

client.once("ready", () => { // Get ready status and log it.
    console.log(`\u{2714} ${client.user.tag} is online.`);
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
    console.log(`User ${message.author} ran ${command.action} -- ${command.body}`);
});

// Create a Welcome message with a custom image every time a new member joins the server.
client.on("guildMemberAdd", async (member) => { 
    const img = await generateImage(member)
    member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID).send({
        content: `<@${member.id}> Welcome to the server!`,
        files: [img]
    });
});

client.login(process.env.TOKEN); // Authenticate bot with API token in ./.env