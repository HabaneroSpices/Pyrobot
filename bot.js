require("dotenv").config();

const Discord = require("discord.js");

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ]
});

client.once("ready", () => { // Get ready status
    console.log(`\u{2714} ${client.user.tag} is online.`);
});

client.on("messageCreate", message => { 
    if (message.content.startsWith("!")) { // Listens for messages starting with "!"
        if (message.content.substring(1) === "ping") { // !ping -> Pong
            message.reply("\u{1F3D3} Pong!");
        }
    }
});

client.login(process.env.TOKEN); // Authenticate bot with API token in ./.env