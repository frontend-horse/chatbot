const twitchApi = require('../utils/twitch');

/** @type {Object<string, {name: string, additionalMessage?: string}>} */
const extraDetails = {
	'5t3phdev': {
		name: 'Steph',
		additionalMessage: `Steph's streams are a great place to learn about CSS, Eleventy, and more!`
	},
	ajcwebdev: {
		name: 'Anthony'
	},
	buildingbedrocklayout: {
		name: 'Travis',
		additionalMessage: `Travis is streaming his progress building out the Bedrock Layout component library.`
	},
	fimion: {
		name: 'Alex'
	},
	genericmikechen: {
		name: 'Mike',
		additionalMessage: `Mike's practice frontend dev interviews are a great resource for any frontend devs looking for their next job!`
	},
	geometricjim: {
		name: 'Jim',
		additionalMessage: `Jim's streams are an invaluable resources for learning accessibility tips.`
	},
	jlengstorf: {
		name: 'Jason',
		additionalMessage: `Jason's show Learn With Jason is a great way to learn more about building for the Jamstack!`
	},
	kevinpowellcss: {
		name: 'Kevin',
	},
	lunchdev: {
		name: 'Michael',
	},
	mannimoki: {
		name: 'Manny',
	},
	maxcellw: {
		name: 'Prince',
	},
	peruvianidol: {
		name: 'Mike',
		additionalMessage: `Mike holds office hours for CSS, Eleventy, and more each Friday.`
	},
	trostcodes: {
		name: 'Alex',
		additionalMessage: `Alex's Frontend Horse streams with guests from around web development and web design are a great way to dive into creative coding!`
	},
	whitep4nth3r: {
		name: 'Salma',
	}
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
		const streamerDetails = extraDetails[streamer.toLowerCase()];
		const name = streamerDetails?.name || `@${displayName}`;
		const sentences = [
			`Go check out @${displayName} at ${url}!`
		];

		if (streamerDetails?.additionalMessage) {
			sentences.push(streamerDetails.additionalMessage);
		}

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