const fs = require('fs');
const members = new Map();
const jsonfile = require('jsonfile');

module.exports = {
    name: 'unmute',
    aliases: ['unmut'],
    args: true,
    usage: '<id uživatele | @user#1234>',
    guildOnly: false,
    cooldown: 3,
    permissions: 'KICK_MEMBERS',
	description: 'Dá unmute vybranému členovi',
	execute(message, args, guild) {
        let DM_ = true;
        if (message.channel.type === 'dm') DM_ = false;
        var member;
        var _mute = {};
        if (fs.existsSync(process.cwd() + "/data/mute.json")) {
            _mute = jsonfile.readFileSync(process.cwd() + "/data/mute.json");
        }

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
                if (!member.roles.cache.has("696830855393312828")) return DM_ ? message.channel.send("**"+member.displayName+"** už není mutnutý!") : message.author.send("**"+member.displayName+"** už není mutnutý!");

                console.log(_mute);
                member.roles.set(Object.values(_mute[member.id]));
                delete _mute[member.id];
                fs.writeFileSync(process.cwd() + "/data/mute.json", JSON.stringify(_mute));
                member.send("Byl jsi odmutnut v **KAUFLANDUS GRUPUS**!");
            }
        }, 1000)
    }
}
