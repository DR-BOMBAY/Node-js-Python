require('dotenv').config();
const prefix = process.env.PREFIX;

module.exports = {
	name: 'pomoc',
	description: 'List všech commandů nebo info o specifickém commandu',
	aliases: ['cmds', 'help'],
    usage: '[jmeno commandu]',
    permissions: '',
	cooldown: 5,
	execute(message, args) {
		const data = [];
        const { commands } = message.client;

        if (!args.length) {
	        data.push('List všech commandů:');
            data.push('\`'+commands.map(command => command.name).join(', ')+'\`');
            data.push(`\nMůžeš napsat \`${prefix}pomoc [jmeno commandu]\` aby jsi viděl info o specifickém commandu!`);

            return message.author.send(data, { split: true })
            .then(() => {
		        if (message.channel.type === 'dm') return;
		            message.reply('List všech commandů ti byl poslán do DM!');
                })
                .catch(error => {
		            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
		            message.reply('vypadáto že ti nejde poslat zprávu do DM! Pokud chceš vidět list commandů zapni si DM!');
	            });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
	        return message.reply('to není validní command!');
        }

        data.push(`**Jméno:** ${command.name}`);

        if (command.aliases) data.push(`**Aliasy:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Popis:** ${command.description}`);
        if (command.usage) data.push(`**Použití:** \`${prefix}${command.name} ${command.usage}\``);

        data.push(`**Cooldown:** ${command.cooldown || 3}s`);

        message.channel.send(data, { split: true });
	},
};