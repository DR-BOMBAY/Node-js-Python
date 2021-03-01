const Discord = require('discord.js');

module.exports = {
    name: "eval",
    args: true,
    usage: '<to tě nemusí zajímat>',
    guildOnly: false,
    cooldown: 3,
    permissions: 'ADMINISTRATOR',
    description: 'To tě nemusí zajímat',
    execute(message, args, guild, client) {
        if (message.author.id === '697770670964080640'); else return;
        const codeString = args.join(' ');
        const result = eval(codeString);
        //console.log(result);

        const embed = new Discord.MessageEmbed()
            .setDescription('```'+result+'```')
        message.channel.send(embed);
    }
}