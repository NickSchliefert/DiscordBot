/* Initialization */
const Discord = require('discord.js');
const CoinGecko = require('coingecko-api');


    // Get current price of a crypto that the user requests
async function getRandom(message, args, CoinGeckoClient) {

    let response = await CoinGeckoClient.coins.all({per_page: 200, 
                                                    localization: false});

    var randomCoin = response.data[Math.floor(Math.random()*response.data.length)];

    console.log(response.data.length);
    console.log(randomCoin);
    if (response.success === false) {
        message.reply('ERROR: ' + randomCoin.error + '. Please check CoinGecko for the correct id and try again. \n https://www.coingecko.com/');
    } else {
        try {
            const responseEmbed = new Discord.MessageEmbed()
            .setTitle(randomCoin.name + ' (' + randomCoin.symbol.toUpperCase() + ')')
            .setThumbnail(randomCoin.image.small)
            .addFields(
                {name: 'Current Price', value: 'USD $' + randomCoin.market_data.current_price.usd.toLocaleString('en-US')},
                {name: '24h %', value: Number(randomCoin.market_data.price_change_percentage_24h/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '7d %', value: Number(randomCoin.market_data.price_change_percentage_7d/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '30d %', value: Number(randomCoin.market_data.price_change_percentage_30d/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '60d %', value: Number(randomCoin.market_data.price_change_percentage_60d/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '200d %', value: Number(randomCoin.market_data.price_change_percentage_200d/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '1y %', value: Number(randomCoin.market_data.price_change_percentage_1y/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true }
            )
            .addFields(
                {name: '24h Trading Volume', value: 'USD $' + randomCoin.market_data.total_volume.usd.toLocaleString('en-US')},
                {name: 'Market Cap', value: 'USD $' + randomCoin.market_data.market_cap.usd.toLocaleString('en-US') + ' **#' + randomCoin.market_data.market_cap_rank + '**'},
                {name: 'Circulating Supply', value: parseInt(randomCoin.market_data.circulating_supply).toLocaleString('en-US')}
            )
            .setURL('https://www.coingecko.com/en/coins/' + randomCoin.id)
            .setFooter('To find this coin again, use the id: ' + randomCoin.id);
        
            message.channel.send(responseEmbed);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command! Please try again.');
        }
    }
}

module.exports = {
    name: 'random',
    description: 'I\'ll find a random cryptocurrency from the top 200 for you to enjoy!',
    usage: ' ',
    aliases: ['r'],
    cooldown: 30,
    execute(message, args, CoinGeckoClient) {
            getRandom(message, args, CoinGeckoClient);
    }
}