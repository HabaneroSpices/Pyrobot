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

client.on("guildMemberAdd", async (member) => {
    const img = await generateImage(member)
    member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID).send({
        content: `<@${member.id}> Welcome to the server!`,
        files: [img]
    });
});

client.login(process.env.TOKEN); // Authenticate bot with API token in ./.env