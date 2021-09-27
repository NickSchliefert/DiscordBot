    /* Initialization */
const Discord = require('discord.js');
const CoinGecko = require('coingecko-api');

    // Get current price of a crypto that the user requests
async function getCurrentPrice(message, args, CoinGeckoClient) {
    var coin = args.join('-').toLowerCase();

    let response = await CoinGeckoClient.coins.fetch(coin, {tickers: false,
                                                            market_data: true,
                                                            community_data: false,
                                                            developer_data: false,
                                                            localization: false});

    console.log(response.data);

    if (response.success === false) {
        message.reply('ERROR: ' + response.data.error + '. Please check CoinGecko for the correct id and try again. \n https://www.coingecko.com/');
    } else {
        try {
            const responseEmbed = new Discord.MessageEmbed()
            .setTitle(response.data.name + ' (' + response.data.symbol.toUpperCase() + ')')
            .setThumbnail(response.data.image.small)
            .addFields(
                {name: 'Current Price', value: 'USD $' + response.data.market_data.current_price.usd.toLocaleString('en-US')},
                {name: '24h %', value: Number(response.data.market_data.price_change_percentage_24h/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '7d %', value: Number(response.data.market_data.price_change_percentage_7d/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '30d %', value: Number(response.data.market_data.price_change_percentage_30d/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '60d %', value: Number(response.data.market_data.price_change_percentage_60d/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '200d %', value: Number(response.data.market_data.price_change_percentage_200d/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true },
                {name: '1y %', value: Number(response.data.market_data.price_change_percentage_1y/100).toLocaleString('en-US', {style: 'percent', minimumFractionDigits:2}), inline: true }
            )
            .addFields(
                {name: '24h Trading Volume', value: 'USD $' + response.data.market_data.total_volume.usd.toLocaleString('en-US')},
                {name: 'Market Cap', value: 'USD $' + response.data.market_data.market_cap.usd.toLocaleString('en-US') + ' | **#' + response.data.market_data.market_cap_rank + '**'},
                {name: 'Circulating Supply', value: parseInt(response.data.market_data.circulating_supply).toLocaleString('en-US')}
            )
            .setURL('https://www.coingecko.com/en/coins/' + response.data.id)
            .setFooter('To find this coin again, use the id: ' + response.data.id);
        
            message.channel.send(responseEmbed);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command! Please try again.');
        }
    }
}

module.exports = {
    name: 'price',
    description: 'I\'ll find you the current price data of a cryptocurrency that you ask for!',
    usage: '<coin-name>',
    aliases: ['p'],
    example: 'Basic Attention Token \n**Note: **If you encounter an error finding a particular coin, please check CoinGecko for the correct API ID needed to find the coin.',
    cooldown: 30,
    execute(message, args, CoinGeckoClient) {
        if (!args.length) {
            return message.reply(`you forgot something! Try again using the following format: \`!price [coin name]\``);
        } else {
            getCurrentPrice(message, args, CoinGeckoClient);
        }
    }
}