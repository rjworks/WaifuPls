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
                // just so that it doesn't show nothing when an anime/waifu doesn't have a description
                const animeDescription = waifu.appearances[ 0 ].description == "" ? "No description given :(" : waifu.appearances[ 0 ].description;
                const waifuDescription = waifu.description == "" ? "No description given :(" : waifu.description;
                // embedded reply
                const exampleEmbed = new discord.MessageEmbed()
                    .setColor( '#f59542' )
                    .setTitle( waifu.name )
                    .setURL( waifu.url )
                    .setAuthor( 'WaifuPls', pfp, github )
                    .setDescription( waifuDescription )
                    .addFields(
                        {
                            name: `Anime`,
                            value: `[${ waifu.appearances[ 0 ].name }](${ waifu.appearances[ 0 ].url })` + " - " + animeDescription
                        },
                        { name: 'Likes', value: waifu.likes },
                        { name: 'Trash', value: waifu.trash },
                    )
                    .setImage( waifu.display_picture )
                    .setTimestamp()
                    .setFooter( 'WaifuPls', pfp );
                msg.reply( exampleEmbed )
            } )
                break;
            case "daily":
                waifuApi.getDailyWaifu().then( ( waifu ) => {
                    // normally this happens when there's too much requests
                    if ( waifu == null ) {
                        msg.reply( "oop! Pls slow down :)" )
                        return;
                    }
                    // just so that it doesn't show nothing when an anime/waifu doesn't have a description
                    const animeDescription = waifu.appearances[ 0 ].description == "" ? "No description given :(" : waifu.appearances[ 0 ].description;
                    const waifuDescription = waifu.description == "" ? "No description given :(" : waifu.description;
                    // embedded reply
                    const exampleEmbed = new discord.MessageEmbed()
                        .setColor( '#f59542' )
                        .setTitle( waifu.name )
                        .setURL( waifu.url )
                        .setAuthor( 'WaifuPls', pfp, github )
                        .setDescription( waifuDescription )
                        .addFields(
                            {
                                name: `Anime`,
                                value: `[${ waifu.appearances[ 0 ].name }](${ waifu.appearances[ 0 ].url })` + " - " + animeDescription
                            },
                            { name: 'Likes', value: waifu.likes },
                            { name: 'Trash', value: waifu.trash },
                        )
                        .setImage( waifu.display_picture )
                        .setTimestamp()
                        .setFooter( 'WaifuPls', pfp );
                    msg.reply( exampleEmbed )
                } )
                break;
            case "best":
                waifuApi.getBestWaifusThisSeason().then( ( waifu ) => {
                    // normally this happens when there's too much requests
                    if ( waifu == null ) {
                        msg.reply( "oop! Pls slow down :)" )
                        return;
                    }
                    // just so that it doesn't show nothing when an anime/waifu doesn't have a description
                    for ( let i = 0; i < 9; i++){
                        const animeDescription = waifu.appearances[ i ].description == "" ? "No description given :(" : waifu.appearances[ i ].description;
                        const waifuDescription = waifu.description == "" ? "No description given :(" : waifu.description;
                        // embedded reply
                        const exampleEmbed = new discord.MessageEmbed()
                            .setColor( '#f59542' )
                            .setTitle( waifu[i].name )
                            .setURL( waifu[i].url )
                            .setAuthor( 'WaifuPls', pfp, github )
                            .setDescription( waifuDescription )
                            .addFields(
                                {
                                    name: `Anime`,
                                    value: `[${ waifu[i].appearances[ 0 ].name }](${ waifu[i].appearances[ 0 ].url })` + " - " + animeDescription
                                },
                                { name: 'Likes', value: waifu[i].likes },
                                { name: 'Trash', value: waifu[i].trash },
                            )
                            .setImage( waifu[i].display_picture )
                            .setTimestamp()
                            .setFooter( 'WaifuPls', pfp );
                        msg.reply( exampleEmbed )
                    }
                } )
                break;
            case "setprefix":
                for(let perm of modPerms){
                    if(!msg.guild.member(msg.author).hasPermission(perm)){
                        msg.reply(config.no_perm);
                        return false;
                    }
                }
                console.log(args[0])
                if(args[0] === undefined){
                    msg.reply("usage: " + config.prefix + "setprefix [prefix]")
                    return;
                }
                config.prefix = args[0];
                fs.writeFileSync("config.json", JSON.stringify(config));
                msg.reply("my prefix has been update to ``" + config.prefix+"``")
                break;
            case "help":
            default:
                msg.reply(help())
                break;

        }
    }
});

const help = () => {
    return new discord.MessageEmbed()
        .setColor( '#f59542' )
        .setTitle("Available commands")
        .setAuthor( 'WaifuPls', pfp, github )
        .addField(`${config.prefix}help`, "Sends list of commands")
        .addField(`${config.prefix}waifupls`, "Sends a random waifu")
        .addField(`${config.prefix}animepls`, "Sends a random anime (TODO)")
        .addField(`${config.prefix}setprefix`, "(MOD ONLY) Sets the bot's prefix")
        .setImage( pfp )
        .setTimestamp()
        .setFooter( 'WaifuPls', pfp )
}


client.login( config.bot_token );
