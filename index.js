const tmi = require('tmi.js');
require('dotenv').config();

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: ['SomeAnticsDev'],
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	}
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	console.log(`${tags['display-name']}: ${message}`);
});