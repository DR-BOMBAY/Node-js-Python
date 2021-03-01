module.exports = {
    name: 'kick',
    aliases: ['kik', 'kop'],
    args: true,
    usage: '<id uživatele | @user#1234> [důvod]',
    guildOnly: false,
    cooldown: 3,
    permissions: 'KICK_MEMBERS',
    description: 'Kickne vybraného člena',
    execute(message, args, guild) {
        let DM_ = true;
        if (message.channel.type === 'dm') DM_ = false;
        var member;

        if (Number(args[0])) {
            guild.members.fetch(args[0]).then(fetchedMembers => {
                members.set(1, fetchedMembers);
            })
        } else {
            member = message.mentions.members.first();
        }

        setTimeout(() => {
            if (Number(args[0])) member = members.get(1);
            if (member) {
                DM_ ? message.channel.send("**"+member.displayName+"** byl kicknut!") : message.author.send("**"+member.displayName+"** byl kicknut!");
                member.send("Byl jsi kicknut z **KAUFLANDUS GRUPUS**!\nDůvod: ``"+args[1]+"``");

                member.kick();
            }
        }, 1000)
    }
}