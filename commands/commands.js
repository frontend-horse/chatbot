const availableCommands = [
  "!blog <search query>",
  "!chan",
  "!commands",
  "!discord",
  "!stream <search query>",
  "!theme",
  "!twitter",
  "!uses",
  "!youtube",
];

/**
 * Command to list out all generally available commands
 *
 * @param {import('tmi.js').Client} client - Twitch chat client
 * @param {'command'} command - triggered command
 * @param {string} body - message body after the command
 */
module.exports = function commands(client, command, body) {
  client.say(
    process.env.TWITCH_BROADCASTER_USERNAME,
    "Available commands: " + availableCommands.join(" • ")
  );
};
