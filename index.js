const tmi = require("tmi.js");
require("dotenv").config();

const listCommands = require("./commands/commands");
const searchForStream = require("./commands/stream");
const shoutOut = require("./commands/so");

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [process.env.TWITCH_BROADCASTER_USERNAME],
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
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
  discord: () =>
    say(
      "Join the friendly and creative Frontend Horse Discord! https://frontend.horse/chat"
    ),
  theme: () =>
    say(
      "The VS Code theme is Free Code Camp Dark Theme - https://www.freecodecamp.org/news/vs-code-dark-mode-theme/"
    ),
  twitter: () =>
    say(
      "Follow Frontend Horse on Twitter at https://twitter.com/FrontendHorse"
    ),
  uses: () => say(`Check out Alex's whole setup at https://trost.codes/uses/`),
  youtube: () =>
    say(`Catch up with previous streams at https://www.youtube.com/AlexTrosts`),

  // More complicated commands
  commands: listCommands,
  stream: searchForStream,
};

/** @type {Object<string, Command>} */
const moderatorCommands = {
  // Simple call-and-response commands
  frontendhorse: () =>
    say("Join the Frontend Horse Discord! https://frontend.horse/chat"),
  lunchdev: () =>
    say("Join the Lunch Dev Discord server! https://discord.gg/lunchdev"),
  theclaw: () =>
    say("Join the Claw Discord server! https://discord.gg/theclaw"),

  // More complicated commands
  shoutout: shoutOut,
  so: shoutOut,
};

const COMMAND_REGEX = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

client.on("message", (ircChannel, tags, message, self) => {
  // console.log(`${tags['display-name']}: ${message}`);
  const isBot = tags.username.toLowerCase() === process.env.TWITCH_BOT_USERNAME;
  if (isBot) return;

  const channel = ircChannel.toLowerCase().replace("#", "");
  const isBroadcaster = tags.username.toLowerCase() === channel;
  const isMod = isBroadcaster || tags.mod;
  // console.log({isBroadcaster, isMod, channel})

  if (message.startsWith("!")) {
    const [raw, command, body] = message.match(COMMAND_REGEX);
    const noop = () => {};

    const executeCommand =
      (isMod && moderatorCommands[command]) || commands[command] || noop;

    executeCommand(client, command, body);
  }
});
