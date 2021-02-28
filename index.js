const discord = require( 'discord.js' );
const client = new discord.Client();
const fs = require( 'fs' );
const WaifuApi = require( "./api/WaifuApi" );
const config = JSON.parse( fs.readFileSync( "config.json", "utf-8" ) );
const waifuApi = new WaifuApi( config.mywaifulist_key );
const pfp = 'https://github.com/rjworks/WaifuPls/blob/master/assets/pfp.jpg?raw=true';
const github = 'https://github.com/rjworks/WaifuPls';
const modPerms = ["ADMINISTRATOR","MANAGE_MESSAGES"];

client.on( 'ready', () => {
    console.log( `Logged in as ${ client.user.tag }!` );
} );

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
            waifuApi.getRandomWaifu().then( ( waifu ) => {
                // normally this happens when there's too much requests
                if ( waifu == null ) {
                    msg.reply( "oop! Pls slow down :)" )
                    return;
                }
                const fields =
                    [{
                        name: `Anime`,
                        value: `[${ waifu.appearances[ 0 ].name }](${ waifu.appearances[ 0 ].url })` + " - " + waifu.appearances[ 0 ].description,
                    },
                        { name: 'Likes', value: waifu.likes },
                        { name: 'Trash', value: waifu.trash }
                    ];
                msg.reply( embed( `[Random waifu] ${ waifu.name }`, waifu.description, waifu.url, fields, waifu.display_picture ) )
            } )
                break;
            case "daily":
                waifuApi.getDailyWaifu().then( ( waifu ) => {
                    if ( waifu == null ) {
                        msg.reply( "oop! Pls slow down :)" )
                        return;
                    }
                    const fields =
                        [{
                            name: `Anime`,
                            value: `[${ waifu.appearances[ 0 ].name }](${ waifu.appearances[ 0 ].url })` + " - " + waifu.appearances[ 0 ].description
                        },
                            { name: 'Likes', value: waifu.likes },
                            { name: 'Trash', value: waifu.trash },
                        ];
                    msg.reply( embed( `[Daily waifu] ${ waifu.name }`, waifu.description, waifu.url, fields, waifu.display_picture ) );
                } )
                break;
            case "best":
                waifuApi.getBestWaifusThisSeason().then( ( waifu ) => {
                    if ( waifu == null ) {
                        msg.reply( "oop! Pls slow down :)" )
                        return;
                    }
                    for ( let i = 0; i < 10; i++ ) {
                        const fields =
                            [{
                                name: `Anime`,
                                value: `[${ waifu[ i ].appearances[ 0 ].name }](${ waifu[ i ].appearances[ 0 ].url })` + " - " + waifu[ i ].appearances[ 0 ].description
                            },
                                { name: 'Likes', value: waifu[ i ].likes },
                                { name: 'Trash', value: waifu[ i ].trash }
                            ];
                        msg.reply( embed(
                            `[#${ i + 1 } best waifu of the season] ${ waifu[ i ].name }`,
                            waifu[ i ].description,
                            waifu[ i ].url,
                            fields,
                            waifu[ i ].display_picture ) );
                    }
                } )
                break;
            case "trash":
                waifuApi.getTrashWaifusThisSeason().then( ( waifu ) => {
                    if ( waifu == null ) {
                        msg.reply( "oop! Pls slow down :)" )
                        return;
                    }
                    for ( let i = 0; i < 10; i++ ) {
                        const fields =
                            [{
                                name: `Anime`,
                                value: `[${ waifu[ i ].appearances[ 0 ].name }](${ waifu[ i ].appearances[ 0 ].url })` + " - " + waifu[ i ].appearances[ 0 ].description
                            },
                                { name: 'Likes', value: waifu[ i ].likes },
                                { name: 'Trash', value: waifu[ i ].trash }
                            ];
                        msg.reply( embed(
                            `[#${ i + 1 } most trash waifu of the season] ${ waifu[ i ].name }`,
                            waifu[ i ].description,
                            waifu[ i ].url,
                            fields,
                            waifu[ i ].display_picture ) );
                    }
                } )
                break;
            case "popular":
                waifuApi.getPopularWaifusThisSeason().then( ( waifu ) => {
                    if ( waifu == null ) {
                        msg.reply( "oop! Pls slow down :)" )
                        return;
                    }
                    for ( let i = 0; i < 10; i++ ) {
                        const fields =
                            [{
                                name: `Anime`,
                                value: `[${ waifu[ i ].appearances[ 0 ].name }](${ waifu[ i ].appearances[ 0 ].url })` + " - " + waifu[ i ].appearances[ 0 ].description
                            },
                                { name: 'Likes', value: waifu[ i ].likes },
                                { name: 'Trash', value: waifu[ i ].trash }
                            ];
                        msg.reply( embed(
                            `[#${ i + 1 } most popular waifu of the season] ${ waifu[ i ].name }`,
                            waifu[ i ].description,
                            waifu[ i ].url,
                            fields,
                            waifu[ i ].display_picture ) );
                    }
                } )
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

const embed = ( title, description, url, fields, image, color = "#f59542" ) => {
    return new discord.MessageEmbed()
        .setColor( color )
        .setTitle( title )
        .setDescription( description )
        .setURL( url )
        .setAuthor( 'WaifuPls', pfp, github )
        .addFields( fields )
        .setThumbnail( pfp )
        .setImage( image )
        .setTimestamp()
        .setFooter( 'WaifuPls', pfp )
}

const help = () => {
    return new discord.MessageEmbed()
        .setColor( '#f59542' )
        .setTitle( "Available commands" )
        .setAuthor( 'WaifuPls', pfp, github )
        .addField( `${ config.prefix }help`, "Sends the list of available commands", true )
        .addField( `${ config.prefix }random`, "Sends a random waifu", true )
        .addField( `${ config.prefix }daily`, "Sends the waifu of the day", true )
        .addField( `${ config.prefix }best`, "Sends the top 10 best waifus of the season", true )
        .addField(`${config.prefix}popular`, "Sends the top 10 most popular waifus of the season", true)
        .addField(`${config.prefix}trash`, "Sends the top 10 most trash waifus of the season", true)
        .addField(`${config.prefix}search <waifu>`, "Sends information about the given waifu (TODO)", true)
        .addField(`${config.prefix}setprefix <prefix>`, "(MOD ONLY) Sets the bot's prefix", true)
        .addField(`${config.prefix}animepls`, "Sends a random anime (TODO)", true)
        .setThumbnail( pfp )
        .setTimestamp()
        .setFooter( 'WaifuPls', pfp )
}


client.login( config.bot_token );
