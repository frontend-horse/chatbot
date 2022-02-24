const twitchApi = require("../utils/twitch");

/** @type {Object<string, {name: string, additionalMessage?: string}>} */
const extraDetails = {
  peruvianidol: {
    name: "Mike",
    additionalMessage: `Mike holds office hours for CSS, Eleventy, and more each Friday.`,
  },
};

/**
 * Command to shout out a fellow streamer
 *
 * @param {import('tmi.js').Client} client - Twitch chat client
 * @param {'shoutout' | 'so'} command - triggered command
 * @param {string} body - message body after the command
 */
module.exports = async function shoutOut(client, command, body) {
  try {
    if (!body) return;

    let [username] = body.split(" ");
    username = username.replace("@", "");
    const user = await twitchApi.users.getUserByName(username);
    const channel = await twitchApi.channels.getChannelInfo(user.id);

    const displayName = user?.displayName;
    const url = `https://twitch.tv/${displayName}`;
    const streamerDetails = extraDetails[username.toLowerCase()];
    const firstName = streamerDetails?.name || `@${displayName}`;

    const sentences = [`Go check out @${displayName} at ${url}!`];

    if (streamerDetails?.additionalMessage) {
      sentences.push(streamerDetails.additionalMessage);
    }

    // User has a recent enough stream with a holdover title
    if (channel?.title) {
      sentences.push(
        `${firstName}'s most recent stream was "${channel.title}"`
      );
    }

    const message = sentences.join(" ");
    client.say(process.env.TWITCH_BROADCASTER_USERNAME, message);
  } catch (err) {
    console.error({ err });
  }
};
