const Discord = require('discord.js');
const axios = require('axios')
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'waifupls') {
        //console.log(getRandomWaifu())
        msg.reply('pong');
    }
});

client.login('');

function getRandomWaifu(){}