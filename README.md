# ReportBot

A WIP discord bot.

## Functionality

The main goal of this project is to deliver a bot responsible for handling a ***user reporting user*** process.

Features include:

- Creating a new discord text channel only the user invoking the command and customisable roles have access to.
- Incremental channel names.
- Ability to reset the incremental counter.
- Ability to delete all created channels, with feedback on how many channels were deleted.
- Automated channel category management and embedded links.
- Permission checks to block off management commands.
- Message logging with user and ID information.

## Usage

1. [Node.js 6.0.0](https://nodejs.org/en/download/) or newer is required.
2. discord.js is required. Execute the following in a terminal to install the package: `npm install discord.js`
3. Ignore any warnings about unmet peer dependencies, as they're all optional.
4. Add a new application in the [Discord Developer Portal](https://discordapp.com/developers/applications).
5. Add a bot into the application.
6. Copy the bot token into [config.json](config.json).
7. Open a new cmd window in the repository directory.
8. Launch the bot using `node .`
9. Invite the bot to your preferred server(s).
10. Good to go.
