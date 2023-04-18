import { SlashCommandBuilder,Role,PermissionFlagsBits,MessageAttachment } from 'discord.js';
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
        
            // Async rendering... 
            const attachment = new MessageAttachment(`https://cdn.aivo.chat${character.avatar}`); 
        
                
            interaction.editReply({ content: `**${character.name}**\n${character.description}`,  files: [attachment], ephemeral: false }); 
        },
        
};
