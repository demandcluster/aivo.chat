import { SlashCommandBuilder,Role,PermissionFlagsBits,AttachmentBuilder } from 'discord.js';
import {store} from '../db'


module.exports = {
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Get details about an AIVO character')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the character you are lookig for')
                .setRequired(true))
        .setDMPermission(false),
       
        async execute(interaction: any) { 
            
            const char = interaction.options.getString('name') 
            const interactionId = interaction.id;  
            
            const character = await store.characters.getPublicCharacter(char) 
           
        
            if(!character) { 
                await interaction.reply({content:"Character does not exist", ephemeral: true }); 
                return; 
            } 
        
         const persona:any = character?.persona?.attributes
         const {age=[],gender=["Prefers not to say"]} = persona?? {}
         let charAge=age
         let charGender=gender[0]
         if(age[0]){
             charAge=age[0].split(' ')[0]
         }
         const summary = character.description ? character.description:''
            // Async rendering... 
          const embed = {
            "title": character.name,
            "description": summary,
            "type": "rich",
            "url": `https://aivo.chat/likes/${character._id}/profile`,
            "color": 0x00FFFF,
            "fields": [
                {
                "name": `Age`,
                "value": charAge,
                "inline": true
                },
                {
                "name": `Gender`,
                "value": charGender.toUpperCase(),
                "inline": true
                }
             ],
            "image":{
                "url": `https://cdn.aivo.chat${character.avatar}`
                },
            "footer": {
                    "text": `AIVO.CHAT Character`,
                    "icon_url": `https://aivo.chat/favicon.d0653b67.ico`
                  },
          }
                
            await interaction.reply({ "allowed_mentions": {
                "replied_user": true,
                "parse": [
                  "users"
                ]
              },content: "Here is the AIVO profile you asked for:",embeds: [embed], ephemeral: false });
        
        },
        
};
