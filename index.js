const tmi = require('tmi.js');
require('dotenv').config();

const searchForBlogPost = require('./commands/blog');
const searchForStream = require('./commands/stream');

const commands = {
	blog: searchForBlogPost,
	stream: searchForStream
};

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: [process.env.TWITCH_BROADCASTER_USERNAME],
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	}
});

client.connect();

const COMMAND_REGEX = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

client.on('message', (channel, tags, message, self) => {
	// console.log(`${tags['display-name']}: ${message}`);
	const isBot = tags.username.toLowerCase() === process.env.TWITCH_BOT_USERNAME;
	if (isBot) return;

	const [raw, command, body] = message.match(COMMAND_REGEX);
	if (command) {
		const noop = () => {};
		const executeCommand = commands[command] || noop;
		executeCommand(client, command, body);
	}
});