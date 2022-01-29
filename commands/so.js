const twitchApi = require('../utils/twitch');

/** @type {Object<string, string>} */
const names = {
	'5t3phdev': 'Steph',
	ajcwebdev: 'Anthony',
	buildingbedrocklayout: 'Travis',
	fimion: 'Alex',
	genericmikechen: 'Mike',
	geometricjim: 'Jim',
	jlengstorf: 'Jason',
	lunchdev: 'Michael',
	mannimoki: 'Manny',
	maxcellw: 'Prince',
	peruvianidol: 'Mike',
	trostcodes: 'Alex',
	whitep4nth3r: 'Salma',
};

/**
 * 
 * @param {string} username - channel being shouted out
 * @returns {string} display name
 */
async function getDisplayName(username) {
	const user = await twitchApi.users.getUserByName(username);
	return user.displayName;
}

/**
 * Gets the shouted-out channel's most recent stream title, if there is one.
 * 
 * @param {string} username - channel being shouted out
 * @returns {string | null} - title of channel's most recent stream
 */
async function getLatestStream(username) {
	const user = await twitchApi.users.getUserByName(username);
	const channel = await twitchApi.channels.getChannelInfo(user.id);
	return channel.title;
}

/**
 * Command to shout out a fellow streamer
 * 
 * @param {import('tmi.js').Client} client - Twitch chat client
 * @param {'so'} command - triggered command
 * @param {string} body - message body after the command
 */
 module.exports = async function shoutOut(client, command, body) {
	try {
		if (!body) return;

		let [streamer] = body.split(' ');
		streamer = streamer.replace('@', '');

		const displayName = await getDisplayName(streamer);
		const url = `https://twitch.tv/${displayName}`;
		const name = names[streamer.toLowerCase()] || `@${displayName}`;
		const sentences = [
			`Go check out @${displayName} at ${url}!`
		];

		const latestStream = await getLatestStream(streamer);
		if (latestStream) {
			sentences.push(`${name}'s most recent stream was "${latestStream}"`);
		}

		const message = sentences.join(' ');
		client.say(process.env.TWITCH_BROADCASTER_USERNAME, message);
	} catch (err) {
		console.error({err});
	}
}