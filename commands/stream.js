const algoliasearch = require('algoliasearch');

const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
const index = algoliaClient.initIndex(process.env.ALGOLIA_INDEX_ID);

/**
 * 
 * @param {'!stream'} command - triggered command
 * @param {string} body - message body after the command
 */
module.exports = function searchForStream(command, body) {
	try {
		index
			.search(
				body,
				{
					attributesToRetrieve: ['url', 'title', 'keywords'],
					hitsPerPage: 1
				}
			)
			.then(({hits}) => {
				if (!hits || hits.length === 0) {
					throw `Couldn't find anything`;
				}

				const [hit] = hits;
				const {url: path = '', title = '', keywords = []} = hit;
				const youtubeUrl = keywords.find(kw => kw.includes('youtu.be') || kw.includes('youtube.com'));
				const url = youtubeUrl || `https://someantics.dev${path}`;
				console.log(`Check out "${title}" at ${url}!`);
			})
	} catch (err) {

	}
}