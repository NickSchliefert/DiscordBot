    /* Initialization */
const config = require('../config.json');

module.exports = {
    name: 'help',
    description: 'I\'ll list all of my commands, or find you info about a specific command.',
    usage: '<command-name>',
    aliases: ['commands', 'features', 'functions'],
    cooldown: 5,
    execute(message, args, CoinGeckoClient) {
        const data = [];
        const { features } = message.client;

        if (!args.length) {
            data.push('Here is a list of all my commands: ');
            data.push(features.map(feature => feature.name).join(', '));
            data.push(`\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`);

            return message.channel.send(data, {split: true});
        }

        const name = args[0].toLowerCase();
        const command = features.get(name) || features.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send('OOPS, that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);
        
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
        if (command.example) data.push(`**Example:** ${config.prefix}${command.name} ${command.example}`);
        if (command.cooldown) data.push(`**Cooldown:** ${command.cooldown}`);

        message.channel.send(data, { split: true });
    }
}