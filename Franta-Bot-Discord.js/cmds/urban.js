const ud = require('urban-dictionary');

module.exports = {
    name: "urbandictionary",
    aliases: ['ud', 'úd'],
    args: false,
    usage: '<text který se vyhledá ve slovníku>',
    guildOnly: false,
    cooldown: 3,
    permissions: '',
    description: 'Najde vybraný text na Urban Dictionary.',
    execute(message, args, guild, client) {
      
      args = args.join(' ');
     
      ud.define(args, (error, results) => {
        if (error) {
          message.channel.send(`error - ${error.message}`)
          return
        }

        let _def = results[0]
        
        while(_def.definition.includes('[') || _def.definition.includes(']')) {
          _def.definition = _def.definition.replace('[', '').replace(']', '');
        }
        
        while(_def.example.includes('[') || _def.example.includes(']')) {
          _def.example = _def.example.replace('[', '').replace(']', '');
        }
        
        message.channel.send('**' + _def.word + '\n**\ndefinition: ``'+_def.definition+'``\nexample: ``'+_def.example+'``');
      });
      
    }
}
