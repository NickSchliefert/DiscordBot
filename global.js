/* Initialization */
const Discord = require('discord.js');
const CoinGecko = require('coingecko-api');


    // Get current price of a crypto that the user requests
async function getRandom(message, args, CoinGeckoClient) {

    let response = await CoinGeckoClient.global();

    console.log(response);

    if (response.success === false) {
        message.reply('ERROR: ' + randomCoin.error + '. Please check CoinGecko for the correct id and try again. \n https://www.coingecko.com/');
    } else {
        try {
            const responseEmbed = new Discord.MessageEmbed()
            .setTitle('Global Cryptocurrency Data')
            .addFields(
                {name: 'Active Cryptocurrencies', value: Number(response.data.data.active_cryptocurrencies).toLocaleString('en-US')},
                {name: 'Total Market Cap', value: 'USD $' + Number(response.data.data.total_market_cap.usd).toLocaleString('en-US')},
                {name: 'Total Market Cap 24h Change', value: response.data.data.market_cap_change_percentage_24h_usd.toFixed(2) + '%'},
                {name: 'Total Volume', value: 'USD $' +  Number(response.data.data.total_volume.usd).toLocaleString('en-US')},
                {name: 'BTC / ETH Dominance', value: 'BTC ' +  response.data.data.market_cap_percentage.btc.toFixed(2) + '%'
                     + ' **|** ' + 'ETH ' + response.data.data.market_cap_percentage.eth.toFixed(2) + '%'},

                )
            .setURL('https://www.coingecko.com/en/global_charts')
        
            message.channel.send(responseEmbed);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command! Please try again.');
        }
    }
}

module.exports = {
    name: 'global',
    description: 'I\'ll find you the latest global cryptocurrency data!',
    usage: ' ',
    aliases: ['g'],
    cooldown: 30,
    execute(message, args, CoinGeckoClient) {
            getRandom(message, args, CoinGeckoClient);
    }
}