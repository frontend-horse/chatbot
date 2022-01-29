const tmi = require('tmi.js');
require('dotenv').config();

const searchForBlogPost = require('./commands/blog');
const listCommands = require('./commands/commands');
const searchForStream = require('./commands/stream');
const shoutOut = require('./commands/so');

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

function say(...args) {
	client.say(process.env.TWITCH_BROADCASTER_USERNAME, ...args);
}

/**
 * @callback Command
 * @param {import('tmi.js').Client} client - Twitch chat client
 * @param {string} command - triggered command
 * @param {string} body - message body after the command
 */

/** @type {Object<string, Command>} */
const commands = {
	// Simple call-and-response commands
	discord: () => say('Looking for inclusive web development communities online? Join the Lunch Dev Discord (https://discord.gg/lunchdev) and the Frontend Horse Discord (https://frontend.horse/chat)!'),
	theme: () => say('The VS Code theme is Night Mind, by @b1mind! Check it out at https://marketplace.visualstudio.com/items?itemName=b1m1nd.night-mind'),
	twitter: () => say('Follow Some Antics on Twitter at https://twitter.com/SomeAnticsDev'),
	uses: () => say(`Check out Ben's whole setup at https://benmyers.dev/uses/!`),

	// More complicated commands
	blog: searchForBlogPost,
	commands: listCommands,
	stream: searchForStream
};

/** @type {Object<string, Command>} */
const moderatorCommands = {
	// Simple call-and-response commands
	frontendhorse: () => say('Join the Frontend Horse Discord! https://frontendhorse.chat'),
	lunchdev: () => say('Join the Lunch Dev Discord server! https://discord.gg/lunchdev'),
	reactpodcast: () => say('Join the Lunch Dev Discord server! https://discord.gg/lunchdev'),

	// More complicated commands
	so: shoutOut
};

const COMMAND_REGEX = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

client.on('message', (channel, tags, message, self) => {
	// console.log(`${tags['display-name']}: ${message}`);
	const isBot = tags.username.toLowerCase() === process.env.TWITCH_BOT_USERNAME;
	if (isBot) return;

	const isBroadcaster = tags.username.toLowerCase() === channel;
	const isMod = isBroadcaster || tags.mod;
	
	if (message.startsWith('!')) {
		const [raw, command, body] = message.match(COMMAND_REGEX);
		const noop = () => {};

		const executeCommand = 
			(isMod && moderatorCommands[command]) ||
			commands[command] ||
			noop;

		executeCommand(client, command, body);
	}
});