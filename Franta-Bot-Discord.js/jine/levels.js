const fs = require('fs');
const jsonfile = require('jsonfile');

var stats = {};
if (fs.existsSync(process.cwd() + '/data/stats.json')) {
  stats = jsonfile.readFileSync(process.cwd() + '/data/stats.json');
}

module.exports = {
    execute(message, args, guild, client) {
        if (message.guild.id in stats === false) {
            stats[message.guild.id] = {};
        }
      
        const guildStats = stats[message.guild.id];
        if (message.author.id in guildStats === false) {
              guildStats[message.author.id] = {
                xp: 0,
                level: 0,
                last_message: 0
              };
            }
            
            const userStats = guildStats[message.author.id];
            
            
            
            const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 70 * userStats.level + 200;
            if(userStats.xp >= xpToNextLevel) {
              userStats.level++;
              if(userStats.level >= 100){
                  message.member.roles.add('666403705586974731');
                  message.member.roles.remove('485553906827657218');
              }
              else if(userStats.level >= 70){
                  message.member.roles.add('485553906827657218');
                  message.member.roles.remove('485553456614998036');
              }
              else if(userStats.level >= 40){
                  message.member.roles.add('485553456614998036');
                  message.member.roles.remove('485552692052230164');
              }
              else if(userStats.level >= 25){
                  message.member.roles.add('485552692052230164');
                  message.member.roles.remove('477791001256132619');
              }
              else if(userStats.level >= 10){
                  
                  message.member.roles.add('477791001256132619');
              }
              let lvlchannel = client.channels.cache.get('495140181511503882');
              if(lvlchannel)
                userStats.xp = userStats.xp - xpToNextLevel;
              lvlchannel.send(`${message.author} dosáhl levelu **${userStats.level}**`).then(msg => {
                msg.react("<oznameniskype:725807427340992712>")
              })
              
            }
             if (Date.now() - userStats.last_message > 20000) {
            userStats.xp += Math.floor(Math.random() * (50 - 5) + 5);
            userStats.last_message = Date.now();
            
      
            jsonfile.writeFileSync(process.cwd() + '/data/stats.json', stats);
      
          }
    }
}