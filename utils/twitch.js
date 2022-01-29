const {StaticAuthProvider} = require('@twurple/auth');
const {ApiClient} = require('@twurple/api')

const authProvider = new StaticAuthProvider(
	process.env.TWITCH_BOT_CLIENT_ID,
	process.env.TWITCH_OAUTH_TOKEN	
);

const apiClient = new ApiClient({authProvider});

module.exports = apiClient;