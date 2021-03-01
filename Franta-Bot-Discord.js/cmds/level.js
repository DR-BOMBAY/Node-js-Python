const jsonfile = require('jsonfile');
const fs = require('fs');
const Discord = require('discord.js');

var stats = {};
if (fs.existsSync(process.cwd() + '/data/stats.json')) {
  stats = jsonfile.readFileSync(process.cwd() + '/data/stats.json');
}

module.exports = {
    name: 'level',
    aliases: ['lvl', 'lvl franto'],
    args: false,
    usage: '[@user#1234]',
    guildOnly: true,
    cooldown: 3,
    permissions: '',
	description: 'Ukáže tvůj level, nebo toho koho označíš',
    execute(message, args) {

        const member = message.mentions.members.first() || message.member;

        if (message.guild.id in stats === false) {
            stats[message.guild.id] = {};
        }
      
        const guildStats = stats[message.guild.id];
        if (member.id in guildStats === false) return message.channel.send("Nemáš žádný level")
            
        const userStats = guildStats[member.id];

        const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 70 * userStats.level + 200;

        const embed = new Discord.MessageEmbed();
        embed.addField(`${userStats.xp} z ${xpToNextLevel} exp`, `**${userStats.level}**`)
        embed.setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
        embed.setThumbnail(member.user.displayAvatarURL())
        embed.setTimestamp()
        embed.setColor(0x0074ff)
        embed.setFooter('©2021 Frantuv sklep corporejšn')
        message.channel.send(embed);
    }
}