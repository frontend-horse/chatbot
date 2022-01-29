const algoliasearch = require('algoliasearch');

const algoliaClient = algoliasearch(process.env.ALGOLIA_BLOG_APP_ID, process.env.ALGOLIA_BLOG_API_KEY);
const index = algoliaClient.initIndex(process.env.ALGOLIA_BLOG_INDEX_ID);

/**
 * @param {import('tmi.js').Client} client - Twitch chat client
 * @param {'blog'} command - triggered command
 * @param {string} body - message body after the command
 */
module.exports = function searchForBlogPost(client, command, body) {
	try {
		index
			.search(
				body,
				{
					attributesToRetrieve: ['url', 'title'],
					hitsPerPage: 1
				}
			)
			.then(({hits}) => {
				if (!hits || hits.length === 0) {
					throw `Couldn't find anything`;
				}

				const [hit] = hits;
				const {url: path = '', title = ''} = hit;
				const url = `https://benmyers.dev${path}`;
				client.say(process.env.TWITCH_BROADCASTER_USERNAME, `Check out "${title}" at ${url}!`);
			})
	} catch (err) {
		console.error({err});
	}
}