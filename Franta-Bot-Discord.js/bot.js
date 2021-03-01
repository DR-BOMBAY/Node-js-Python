require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client({ partials: ["MESSAGE", "REACTION", "GUILD_MEMBER"]});
client.commands = new Discord.Collection();
client.snipes = new Discord.Collection();

const jine = require('./jine/spam');
const lvls = require('./jine/levels');

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./cmds/${file}`);

	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

const prefix = process.env.PREFIX;

const userData = new Map();

client.once('ready', () => {
    console.log('Online!');
    client.user.setActivity("rozkazy na slovo", {type: "LISTENING"});
});

client.on('message', message => {
    
	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const guild = client.guilds.cache.find(guild => guild.id === "456060911573008385");

    if (message.channel.type === 'dm') {
    } else {
        jine.execute(message, guild, userData);
        lvls.execute(message);
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('Tento commmand nefunguje v DM!');
    }

    if (command.permissions) {
        const authorPerms = client.guilds.cache.find(guild => guild.id === "456060911573008385").members.cache.find(member => member.id === message.author.id);
        if (!authorPerms || !authorPerms.hasPermission(command.permissions)) {
         	return message.reply('Vypadá to že nemáš povolení!');
        }
    }

    if (command.args && !args.length) {
        let reply = `Nezadal jsi žádné argumenty, ${message.author}!`;
        if (command.usage) {
            reply += `\nPoužití commandu: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

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
		    return message.reply(`počkej ještě ${timeLeft.toFixed(1)} s před použitím \`${command.name}\` commandu.`);
	    }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
        command.execute(message, args, guild, client);
    } catch (error) {
        console.error(error);
        message.reply('Oběvil se error při spuštění tohoto commandu!');
    }
});

client.on('messageDelete', message => {
    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    });
});

client.on('messageReactionAdd', (reaction, user) => {
    const id = reaction.emoji.id;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '814912575887245374') {
        switch (id) {
            case '814910570503471164':
                member.roles.add("658418366423236636");
                break;
            case '814910019950346289':
                member.roles.add("575314273149124665");
                break;
            case '814910570570317835':
                member.roles.add("697880456690925598");
                break;
            case '814910753705426944':
                member.roles.add("752184776009449553");
                break;
        }
    }
  
    if (reaction.message.id === '814931641956171817') {
      switch(id) {
        case '666296123673280522':
          member.roles.add('666296155923283969');
          break;
      }
    }
});

client.on('messageReactionRemove', (reaction, user) => {
    const id = reaction.emoji.id;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '814912575887245374') {
        switch (id) {
            case '814910570503471164':
                member.roles.remove("658418366423236636");
                break;
            case '814910019950346289':
                member.roles.remove("575314273149124665");
                break;
            case '814910570570317835':
                member.roles.remove("697880456690925598");
                break;
            case '814910753705426944':
                member.roles.remove("752184776009449553");
                break;
        }
    } 
})

client.login(process.env.BOT_TOKEN);