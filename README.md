**discord.xr**

## About
discord.xr is a powerful [Node.js](https://nodejs.org) [Discord API](https://discord.com/developers/docs/intro) wrapper.

## Installation

**Node.js 12.0.0 or newer is required.**  
PC or VDS: `npm install discord.xr` <br>
Glitch: `pnpm install discord.xr`  

## Example usage
```js
const Discord = require('discord.xr');
const client = new Discord('TOKEN');

client.on('ready', () => {
console.log(`Logged in as ${client.user.tag}`)
});

client.on('messageCreate', function(message) {
    if (message.content === 'ping'){
        message.channel.send('Pong!');
    }
});
client.connect();
```

## Links

- Website: SOON!
- Documentation: SOON!
- [Discord.XR Discord server](https://discord.gg/ThFShJZ)
- [Discord API Discord server](https://discord.gg/discord-api)
- [NPM](https://www.npmjs.com/package/discord.xr)

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Discord.XR Support Server!](https://discord.gg/ThFShJZ)
