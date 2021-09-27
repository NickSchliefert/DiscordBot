/* Initialization */
const config = require('../config.json');

module.exports = {
    name: 'tip',
    description: 'Tip the developer behind Cash! the Crypto Companion!',
    usage: ' ',
    aliases: ['donate'],
    cooldown: 5,
    execute(message, args, CoinGeckoClient) {
        message.channel.send(`If you would like to tip the developer behind Cash! the Crypto Companion in either Bitcoin or Ethereum, ` +
        `you can do so by sending to the following addresses: \nBitcoin: ||${config.btcaddress}||\nEthereum: ||${config.ethaddress}||`);
    }
}