const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(message) {
		const messageDelay = Date.now() - message.createdTimestamp;
        await message.reply(`\u{1F3D3} Pong! ${messageDelay}ms`);
	},
};
