const { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction,ApplicationCommandOptionType } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration')

module.exports = {
  name: 'config-suggestion',
  description: 'Configure a suggestion.',
  dm_permission: false,


  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    
    let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId });
        if (!guildConfiguration) {
          guildConfiguration = new GuildConfiguration ({ guildId: interaction.guildId });
        };
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'add') {
            const channel = interaction.options.getChannel('channel-add');
          
        if (guildConfiguration.suggestionChannelIds.includes(channel.id)) {
             await interaction.reply(`${channel} is already a suggestions channel.`);
            return;
        }
          
        guildConfiguration.suggestionChannelIds.push(channel.id);
            await guildConfiguration.save();
            await interaction.reply(`Added ${channel} to suggestion channels.`);
            return;
        }
          
        if (subcommand === 'remove') {
        const channel = interaction.options.getChannel('channel-remove');
          
        if (!guildConfiguration.suggestionChannelIds.includes(channel.id)) {
            await interaction.reply(`${channel} is not a suggestion channel.`);
            return;
        }
          
        const index = guildConfiguration.suggestionChannelIds.indexOf(channel.id);
            guildConfiguration.suggestionChannelIds.splice(index, 1);
            await guildConfiguration.save();
            await interaction.reply(`Removed ${channel} from suggestion channels.`);
            return;
        }
  },
 
    options: [
        {
          name: 'add',
          description: "add a suggestions channel",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
              {
                  name: 'channel-add',
                  description: 'the channel you want to add',      
                  type: ApplicationCommandOptionType.Channel,              }
             
              ],
          },
          
   
{

  name: 'remove', 
    description: "Remove a suggestions channel.",
    type: ApplicationCommandOptionType.Subcommand,

    options: [
        {
            name: 'channel-remove',
            description: 'The suggestion channel you want to remove.',
            type: ApplicationCommandOptionType.Channel,
            
        },
      ],
},
],
  
};
    

   