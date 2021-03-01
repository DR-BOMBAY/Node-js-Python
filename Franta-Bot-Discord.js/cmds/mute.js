const fs = require('fs');
const members = new Map();
const jsonfile = require('jsonfile');

module.exports = {
    name: 'mute',
    aliases: ['mut', 'ticho', 'drzhubukundokrochhajzle'],
    args: true,
    usage: '<id uživatele | @user#1234> <důvod> [čas v minutách]',
    guildOnly: false,
    cooldown: 3,
    permissions: 'KICK_MEMBERS',
	description: 'Dá mute vybranému členovi',
	execute(message, args, guild) {
        let DM_ = true;
        if (message.channel.type === 'dm') DM_ = false;
        var member;
        var _mute = {};
        if (fs.existsSync(process.cwd() + "/data/mute.json")) {
            _mute = jsonfile.readFileSync(process.cwd() + "/data/mute.json");
        }
        var Role = [];

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
                if (member.roles.cache.has("696830855393312828")) return DM_ ? message.channel.send("**"+member.displayName+"** už je mutnutý!") : message.author.send("**"+member.displayName+"** už je mutnutý!");
                member.roles.cache.forEach(role => {
                    Role.push(role.id);
                });
                _mute[member.id] = Object.assign({}, Role);
                fs.writeFileSync(process.cwd() + "/data/mute.json", JSON.stringify(_mute));

                member.roles.set(["696830855393312828"]);

                DM_ ? message.channel.send("**"+member.displayName+"** byl mutnut" + (args.length < 3 ? " " : " na "+args[2]+"min!")) : message.author.send("**"+member.displayName+"** byl mutnut" + (args.length < 3 ? " " : " na "+args[2]+"min!"));
                member.send("Byl jsi mutnut" + (args.length < 3 ? " " : " na "+args[2]+"min ") + "v **KAUFLANDUS GRUPUS**!\nDůvod: ``"+args[1]+"``");

                if (args.length == 3) {
                    if (Number(args[2])) {
                        setTimeout(() => {
                            member.roles.set(Object.values(_mute[member.id]));
                            delete _mute[member.id];
                            fs.writeFileSync(process.cwd() + "/data/mute.json", JSON.stringify(_mute));
                            member.send("Byl jsi odmutnut v **KAUFLANDUS GRUPUS**!");
                        }, args[2] * 1000 * 60);
                    }
                }
            }
        }, 1000)
	},
};