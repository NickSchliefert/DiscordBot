    /* Initialization */
const config = require('./config.json');
const Discord = require('discord.js');
const CoinGecko = require('coingecko-api');
const Moment = require('moment');
const fs = require('fs');

const bot = new Discord.Client();
const CoinGeckoClient = new CoinGecko();

bot.commands = new Discord.Collection();
bot.cooldowns = new Discord.Collection();

    /* Parse features folder for all feature files */

bot.features = new Discord.Collection();

const featureFiles = fs.readdirSync('./features/').filter(file => file.endsWith('.js'));

for (const file of featureFiles) {
    const feature = require(`./features/${file}`);

    bot.features.set(feature.name, feature);
}

    /* Bot Commands */

bot.once('ready', () => {
    console.log('Cash! the Crypto Companion is online!');
});

bot.on('message', message => {

    if(message.mentions.has(bot.user.id)){
        return message.channel.send(`Hi there, I'm Cash! the Crypto Companion.\nMy prefix is simply my name: cash!\nIf you'd like to see my commands, try: cash! help`)
    }

    // Ignore message if it doesnt start with cash!, or if it is from the bot itself
    if (!message.content.toLowerCase().startsWith(config.prefix) || message.author.bot) return;

    const arguments = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = arguments.shift().toLowerCase();

    const command = bot.features.get(commandName)
        || bot.features.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const { cooldowns } = bot;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, arguments, CoinGeckoClient);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command! Please try again.');
    }
});


bot.login(config.token);