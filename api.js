module.exports = {
    name: 'api',
    description: 'See the API used to power Cash! the Crypto Companion!',
    usage: ' ',
    aliases: ['bot', 'info'],
    cooldown: 5,
    execute(message, args, CoinGeckoClient) {
        message.channel.send('Cash! the Crypto Companion is Powered by CoinGecko. \nhttps://www.coingecko.com/en/api');
    }
}