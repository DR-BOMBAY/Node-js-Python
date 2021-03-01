module.exports = {
    name: 'clear',
    aliases: ['špyna'],
    args: true,
    usage: '<počet zpráv>',
    guildOnly: true,
    cooldown: 3,
    permissions: 'MANAGE_MESSAGES',
	description: 'Vymaže vybraný(max 100) počet zpráv z kanálu.',
    execute(message, args, guild) {
        if (Number(args[0])) {} else return message.channel.send("Zadal jsi špatné argumenty.");
        message.channel.messages.fetch().then(messages => {
            messages = messages.keyArray();
            messages = messages.slice(0, args[0] + 1);
            message.channel.bulkDelete(messages, true).catch(error => console.log(error.stack));
            args[0] = Number(args[0]) + 1;
            message.channel.send("Vymazáno **" +args[0]+ "** zpráv.").then(msg => { msg.delete({timeout: 3000}) });
        });
    }
}