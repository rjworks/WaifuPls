const discord = require( 'discord.js' );
const client = new discord.Client();
const fs = require( 'fs' );
const WaifuApi = require( "./api/WaifuApi" );
const config = JSON.parse( fs.readFileSync( "config.json", "utf-8" ) );
const waifuApi = new WaifuApi( config.mywaifulist_key )

client.on( 'ready', () => {
    console.log( `Logged in as ${ client.user.tag }!` );
} );

client.on( 'message', msg => {
    if ( msg.content === 'waifupls' || msg.content === 'waifpls' ) {
        waifuApi.getRandomWaifu().then( ( waifu ) => {
            // normally this happens when there's too much requests
            if ( waifu == null ) {
                msg.reply( "Oop! Pls slow down :)" )
                return;
            }
            // just so that it doesn't show nothing when an anime/waifu doesn't have a description
            const animeDescription = waifu.appearances[ 0 ].description == "" ? "No description given :(" : waifu.appearances[ 0 ].description;
            const waifuDescription = waifu.description == "" ? "No description given :(" : waifu.description;
            const pfp = 'https://github.com/rjworks/WaifuPls/blob/master/pfp.jpg?raw=true';
            // embedded reply
            const exampleEmbed = new discord.MessageEmbed()
                .setColor( '#f59542' )
                .setTitle( waifu.name )
                .setURL( waifu.url )
                .setAuthor( 'WaifuPls', pfp, 'https://github.com/rjworks/WaifuPls' )
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
    }
});


client.login( config.bot_token );
