# SomeAnticsBot

> A Twitch Chatbot for Some Antics

The code that powers SomeAnticsBot, a chatbot hosted on [Heroku](https://heroku.com)

---

## Setting Up a Bot Like This For Yourself

1. Rename `.env.template` to `.env`.
1. Add your channel name to the `.env` as the `TWITCH_BROADCASTER_USERNAME`.
1. Set up a Twitch account to serve as your bot account. Follow [these steps to get a bot OAuth token](https://spacejelly.dev/posts/how-to-create-a-twitch-chat-bot-with-node-js-tmi-js-heroku/#step-2-responding-to-twitch-chat-commands-with-tmijs) from the Twitch account.
	- The Twitch Token Generator tool will give you an access token, a refresh token, and a client ID. Your OAuth token is the access token.
1. Go to your `.env` file, and fill out the `TWITCH_BOT_USERNAME` and `TWITCH_OAUTH_TOKEN`.
1. Set up an Algolia app for your site. If you're using Netlify to host your site, you can follow this [quickstart for using Netlify's Algolia Plugin](https://www.algolia.com/doc/tools/crawler/netlify-plugin/quick-start/).
1. Once your site has been crawled, add your `ALGOLIA_APP_ID`, `ALGOLIA_API_KEY`, and
`ALGOLIA_INDEX_ID` to your `.env` file.
1. Follow [these steps to deploy the bot to Heroku](https://spacejelly.dev/posts/how-to-create-a-twitch-chat-bot-with-node-js-tmi-js-heroku/#step-4-deploying-a-twitch-chat-bot-to-heroku).