const Discord = require('discord.js');
const axios = require('axios')
const client = new Discord.Client();
const fs = require('fs');

let token = "";
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'waifupls') {
        //console.log(getRandomWaifu())
        msg.reply('pong');
    }
});

fs.readFileSync('token.txt', 'utf-8').split(/\r?\n/)
    .forEach(function(line){
        token = line;
});


client.login( token );
