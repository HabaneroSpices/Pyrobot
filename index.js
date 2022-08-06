// Setup.
//
const fs = require('node:fs');
const path = require('node:path');
const log = require("fancy-log");
const { Client, Collection } = require("discord.js");
const { version } = require('./package.json');
const { token, activity, activityType }= require('./config/discord.json');

const client = new Client({intents: ["GUILDS","GUILD_MESSAGES","GUILD_MEMBERS","GUILD_VOICE_STATES"]});

// Load command files
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
    log('(Server) Loaded: %s - commands/%s', command.data.name, file);
}

// Connnected and ready to serve
client.once('ready', () => {
	log(`(Server) ${client.user.tag} version ${version} is online.`);
});

client.on('ready', function() {
    client.user.setActivity(activity, { type: activityType });
});
  
  client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
  
  client.once('disconnect', () => {
    console.log('Disconnect!');
});

// Handle commands
client.on('interactionCreate', async message => {
    if (!message.isCommand()) return;

    const command = client.commands.get(message.commandName);

    if (!command) return;

    try {
		await command.execute(message);
	} catch (error) {
		console.error(error);
		await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

    log(`(Command) User ${message.user.tag} ran ${message.commandName}`);
});

client.login(token);