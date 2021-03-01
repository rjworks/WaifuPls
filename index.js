const discord = require( 'discord.js' );
const client = new discord.Client();
const fs = require( 'fs' );
const WaifuApi = require( "./api/WaifuApi" );
const config = JSON.parse( fs.readFileSync( "config.json", "utf-8" ) );
const waifuApi = new WaifuApi( config.mywaifulist_key );
const pfp = 'https://github.com/rjworks/WaifuPls/blob/master/assets/pfp.jpg?raw=true';
const github = 'https://github.com/rjworks/WaifuPls';
const modPerms = ["ADMINISTRATOR","MANAGE_MESSAGES"];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity({
        type: "WATCHING",
        name: config.prefix + "help"
    });
});

client.on( 'message', msg => {
    if(msg.content === `<@!${client.user.id}>`){
        msg.reply(help())
        return;
    }
    if ( msg.content.startsWith( config.prefix )) {
        const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        switch ( command ){
            case "random":
                waifuApi.getRandomWaifu().then((data) => {
                    // normally this happens when there's too much requests
                    if(data == null){
                        msg.reply("oop! Pls slow down :)")
                        return;
                    }
                    waifuApi.getWaifu(data.slug).then((fullData) =>
                        msg.reply(embed("[Random waifu]", fullData)));
                })
                break;
            case "daily":
                waifuApi.getDailyWaifu().then((data) => {
                    // normally this happens when there's too much requests
                    if(data == null){
                        msg.reply("oop! Pls slow down :)")
                        return;
                    }
                    waifuApi.getWaifu(data.slug).then((fullData) =>
                        msg.reply(embed("[Waifu of the day]", fullData)));
                })
                break;
            case "best":
                waifuApi.getBestWaifusThisSeason().then((data) => {
                    // normally this happens when there's too much requests
                    if(data == null){
                        msg.reply("oop! Pls slow down :)")
                        return;
                    }
                    for(let i = 0; i < 10; i++){
                        waifuApi.getWaifu(data[i].slug).then((fullData) => {
                            msg.reply(embed("[Best waifu of the season]", fullData));
                        })
                    }
                })
                break;
            case "trash":
                waifuApi.getTrashWaifusThisSeason().then((data) => {
                    // normally this happens when there's too much requests
                    if(data == null){
                        msg.reply("oop! Pls slow down :)")
                        return;
                    }
                    for(let i = 0; i < 10; i++){
                        waifuApi.getWaifu(data[i].slug).then((fullData) => {
                            msg.reply(embed("[Most trash waifu of the season]", fullData));
                        })
                    }
                })
                break;
            case "popular":
                waifuApi.getPopularWaifusThisSeason().then((data) => {
                    // normally this happens when there's too much requests
                    if(data == null){
                        msg.reply("oop! Pls slow down :)")
                        return;
                    }
                    for(let i = 0; i < 10; i++){
                        waifuApi.getWaifu(data[i].slug).then((fullData) => {
                            msg.reply(embed("[Most popular waifu of the season]", fullData));
                        })
                    }
                })
                break;
            // todo
            // case "search":
            //     const searchTerm = args[0];
            //     if(searchTerm === undefined){
            //         msg.reply("usage: " + config.prefix + "search <waifu>")
            //         return;
            //     }
            //     waifuApi.searchForWaifu(searchTerm).then((waifu) => {
            //         console.log(waifu)
            //     })
            //     break;
            case "setprefix":
                for ( let perm of modPerms ) {
                    if ( !msg.guild.member( msg.author ).hasPermission( perm ) ) {
                        msg.reply( config.no_perm );
                        return false;
                    }
                }
                if ( args[ 0 ] === undefined ) {
                    msg.reply( "usage: " + config.prefix + "setprefix <prefix>" )
                    return;
                }
                config.prefix = args[ 0 ];
                fs.writeFileSync( "config.json", JSON.stringify( config ) );
                msg.reply( "my prefix has been update to ``" + config.prefix + "``" )
                break;
            case "help":
            default:
                msg.reply( help() )
                break;

        }
    }
} );

const embed = (title, data, color = "#f59542") => {
    let fields =
        [{
            name: `Anime`,
            value: `[${data.data.series.name}](https://mywaifulist.moe/series/+${data.data.series.slug})` + " - " + data.data.series.description.substring(0, 300) + '...',
        },
            {name: 'Likes', value: data.data.likes, inline: true},
            {name: 'Trash', value: data.data.trash, inline: true},
        ];
    data.data.age !== undefined && data.data.age !== null && data.data.age !== 0 ? fields.push({
        name: 'Age',
        value: data.data.age, inline: true
    }) : null;
    data.data.weight !== undefined && data.data.weight !== null ? fields.push({
        name: 'Weight',
        value: data.data.weight + 'kg', inline: true
    }) : null;
    const birthYear = data.data.birthday_year === null || data.data.birthday_year === '' ? "" : ", " + data.data.birthday_year;
    data.data.birthday_month !== null && data.data.birthday_day !== 0 && data.data.birthday_year !== 0 ? fields.push({
        name: 'Birthday',
        value: data.data.birthday_month + ' ' + data.data.birthday_day + birthYear, inline: true
    }) : null;
    data.data.height !== undefined && data.data.height !== null ? fields.push({
        name: 'Height',
        value: data.data.height + 'cm', inline: true
    }) : null;
    data.data.popularity_rank !== undefined && data.data.popularity_rank !== null ? fields.push({
        name: 'Popularity rank',
        value: '#' + data.data.popularity_rank, inline: true
    }) : null;

    return new discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(data.data.description.substring(0, 300) + '...')
        .setURL(data.data.url)
        .setAuthor('WaifuPls', pfp, github)
        .addFields(fields)
        .setThumbnail(pfp)
        .setImage(data.data.display_picture)
        .setTimestamp()
        .setFooter( 'WaifuPls', pfp )
}

const help = () => {
    return new discord.MessageEmbed()
        .setColor('#f59542')
        .setTitle("Available commands")
        .setAuthor('WaifuPls', pfp, github)
        .addField(`${config.prefix}help`, "Sends the list of available commands", true)
        .addField(`${config.prefix}random`, "Sends a random waifu", true)
        .addField(`${config.prefix}daily`, "Sends the waifu of the day", true)
        .addField(`${config.prefix}best`, "Sends the top 10 best waifus of the season", true)
        .addField(`${config.prefix}popular`, "Sends the top 10 most popular waifus of the season", true)
        .addField(`${config.prefix}trash`, "Sends the top 10 most trash waifus of the season", true)
        .addField(`${config.prefix}search <waifu>`, "Sends information about the given waifu (TODO)", true)
        .addField(`${config.prefix}setprefix <prefix>`, "(MOD ONLY) Sets the bot's prefix", true)
        .addField(`${config.prefix}animepls`, "Sends a random anime (TODO)", true)
        .setThumbnail(pfp)
        .setTimestamp()
        .setFooter('WaifuPls', pfp)
}

client.login( config.bot_token );