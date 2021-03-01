const fs = require('fs');
const jsonfile = require('jsonfile');

module.exports = {
    execute(message, guild, userData) {

        const LIMIT = 6;
        const TIME = 7000
        const DIFF = 2500;
        const roleId = "696830855393312828";
        const member = message.member;

        if (message.author.bot) return;

        if (member.roles.highest.position >= guild.roles.cache.get("697085248923762738").position ) return;

        var Role = [];
        var _mute = {};
        if (fs.existsSync(process.cwd() + "/data/mute.json")) {
            _mute = jsonfile.readFileSync(process.cwd() + "/data/mute.json");
        }

        var _warn = {};
        if (fs.existsSync(process.cwd() + "/data/warn.json")) {
            _warn = jsonfile.readFileSync(process.cwd() + "/data/warn.json");
        }

        if (userData.has(message.author.id)) {
            const userMap = userData.get(message.author.id);
            const { lastMessage, timer } = userMap;
            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userMap.msgCount;

            if (_warn[member.id] == undefined) _warn[member.id] = 0;

            if (difference > DIFF) {
                clearTimeout(timer);
                console.log("spam.js: Timeout cleared!");
                userMap.msgCount = 1;
                userMap.lastMessage = message;
                userMap.timeer = setTimeout(() => {
                    userData.delete(message.author.id);
                    console.log("spam.js: RESET cleared!");
                }, TIME);
                userData.set(message.author.id, userMap);
            } else {
                ++msgCount;
                if (parseInt(msgCount) === LIMIT) {
                    _warn[member.id] = _warn[member.id] + 1

                    message.channel.messages.fetch().then(messages => {
                        if (member.id) {
                            messages = messages.filter(m => m.author.id === member.id)
                            messages = messages.keyArray();
                            messages = messages.slice(0, LIMIT);
                        }
                        message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
                    });

                    if (_warn[member.id] === 3) {
                        _warn[member.id] = 0;
                        fs.writeFileSync(process.cwd() + "/data/warn.json", JSON.stringify(_warn));

                        member.roles.cache.forEach(role => {
                            Role.push(role.id);
                        });
                        _mute[member.id] = Object.assign({}, Role);
                        fs.writeFileSync(process.cwd() + "/data/mute.json", JSON.stringify(_mute));

                        member.roles.set([roleId]);
                        userData.delete(message.author.id);

                        message.reply("A už drž hubu holomku!");

                        setTimeout(() => {
                            member.roles.set(Object.values(_mute[member.id]));
                            delete _mute[member.id];
                            fs.writeFileSync(process.cwd() + "/data/mute.json", JSON.stringify(_mute));
                            member.send("Byl jsi odmutnut v **KAUFLANDUS GRUPUS**!");
                        }, 15 * 60 * 1000)
                    } else {
                        userData.delete(message.author.id);
                        fs.writeFileSync(process.cwd() + "/data/warn.json", JSON.stringify(_warn));
                        message.reply("Tohle je tvoje " +_warn[member.id]+ ". varování!")
                    }

                    
                } else {
                    userMap.msgCount = msgCount;
                    userData.set(message.author.id, userMap);
                }
            }
        } else {
            let fn = setTimeout(() => {
                userData.delete(message.author.id);
                console.log("spam.js: Map cleared!");
            }, TIME)

            userData.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn
            });
        }
        
    }
}