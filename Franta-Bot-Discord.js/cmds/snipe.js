const Discord = require('discord.js');

module.exports = {
    name: "snipe",
    aliases: ['snajper385', 'snajper'],
    args: false,
    usage: ' ',
    guildOnly: true,
    cooldown: 3,
    permissions: 'MANAGE_MESSAGES',
    description: 'Ukáže poslední smazanou zprávu v kanálu.',
    execute(message, args, guild, client) {
        const msg = client.snipes.get(message.channel.id);
        if (msg); else return message.reply("Nebyla nalezena žádná smazaná zpráva.")

        let link = msg.image;
        if (link != null) {
            link = link.split('').reverse().join('').split('.')[0].split('').reverse().join('');
            link.toString();
        }
        

        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.author, msg.member.user.displayAvatarURL())
            .setDescription(msg.content)
            .setImage(msg.image)
            const array_ = ['jpeg', 'png', 'gif', 'webp', 'jpg'];
            if (!array_.includes(link) || link != null) embed.addField('Příloha:',`[odkaz](${msg.image})`);
        message.channel.send(embed);
    }
}