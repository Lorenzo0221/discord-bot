const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder,ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    
    .setName("modpanel")
    .setDescription("Moderate a user with this panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
        .setName("target")
        .setDescription("the target of the actions")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("the reason for your action")
        .setRequired(true)
    ),

    callback: async (client, interaction)  => {
        await interaction.deferReply()
        console.log(interaction);
        const {guild, options} = interaction;
        const target = options.getMember("target-user");
        const targetMember = await interaction.guild.members.fetch(target.id)
        const reason = options.getString("reason") || "No Reason given";
        const username = target
        const user = interaction.user.id

        if (target === interaction.user) {
            return await interaction.editReply({
                content: "You cant moderate yourself!",
                ephemeral: true
            })
        }

        //timeout row
        const tRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("1")
            .setLabel("TO 5 Minutes")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("2")
            .setLabel("TO 10 Minutes")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("3")
            .setLabel("TO 1 Hour")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("4")
            .setLabel("TO 1 Day")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("5")
            .setLabel("TO 1 Week")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
        )

        //mod row
        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("ban")
            .setLabel("Ban")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("kick")
            .setLabel("Kick")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("untimeout")
            .setEmoji("✅")
            .setLabel("Untimeout")
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setTitle("Moderation Panel")
        .setColor('Blue')
        //.setImage('file:///C:/Users/loren/Downloads/Banner.png')
        .setDescription(`This is the panel to moderate <@${target.id}>!`)
        .addFields(
            {name: "Name", value: `${username}`, inline: true},
            {name: "User ID", value: `${target.id}`, inline: true},
            {name: "User", value: `<@${target.id}>`, inline: true},
            {name: "Avatar URL", value: `[Avatar](${await target.displayAvatarURL()})`, inline: true},
            {name: "Reason", value: `${reason}`, inline: false}
        )
        .setThumbnail(await target.displayAvatarURL())
        .setTimestamp()

        const msg = await interaction.editReply({
            embeds: [embed],
            components: [Row, tRow],
            ephemeral: true
        });

        const collector = msg.createMessageComponentCollector();

        const embed3 = new EmbedBuilder()
        .setColor('Blue')
        //.setImage('file:///C:/Users/loren/Downloads/Banner.png')
        .setTimestamp()
        .setFooter({ text: `Moderator: ${interaction.user.username}`})

        collector.on('collect', async i => {
            await i.deferReply()
            if (i.customId === "ban") {
                if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                    return await i.editReply({
                        content: "You can't **BAN** Members!",
                        ephemeral: true
                    })
                }

                await interaction.guild.members.ban(target, {reason});

                embed3.setTitle("Ban").setDescription(`You have been banned in ${i.guild.name}! || **Reason:** ${reason}`).setColor('Blue')

                await target.send({ embeds: [embed3] }).catch(err => {
                    return i.editReply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });;

                await i.editReply({ content: `<@${target.id}> has been banned!`, ephemeral: true});
            }

            if (i.customId === "untimeout") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true})
                await target.timeout(null);

                embed.setTitle("Untimeout").setDescription(`You have been untimeouted in ${i.guild.name}! || **Reason:** ${reason}`).setColor('Blue')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.editReply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });;

                await i.editReply({ content: `<@${target.id}> timeout has been removed`, ephemeral: true});
            }

            if (i.customId === "kick") {
                if (!i.member.permissions.has(PermissionFlagsBits.KickMembers)) return await i.reply({ content: "You dont have the permission to **KICK** Members!", ephemeral: true});

                await interaction.guild.members.kick(target, {reason});

                embed.setTitle("Kick").setDescription(`You have been kicked in ${i.guild.name}! || **Reason:** ${reason}`).setColor('Blue')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.editReply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.editReply({ content: `<@${target.id}> has been kicked!`, ephemeral: true});
            }

            if (i.customId === "1") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(300000, reason).catch(err => {
                    return i.editReply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for **5 Minutes** || **Reason:** ${reason}`).setColor('Blue');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.editReply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.editReply({ content: `<@${target.id}> has been timeouted for **5 Minutes**`, ephemeral: true});
            }

            if (i.customId === "2") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(600000, reason).catch(err => {
                    return i.editReply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for **10 Minutes** || **Reason:** ${reason}`).setColor('Blue');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.editReply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.editReply({ content: `<@${target.id}> has been timeouted for **10 Minutes**`, ephemeral: true});
            }

            if (i.customId === "3") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(3600000, reason).catch(err => {
                    return i.editReply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for *1 Hour** || **Reason:** ${reason}`).setColor('Blue');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.editReply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.editReply({ content: `<@${target.id}> has been timeouted for **1 Hour**`, ephemeral: true});
            }

            if (i.customId === "4") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(86400000, reason).catch(err => {
                    return i.editReply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for **1 Day** || **Reason:** ${reason}`).setColor('Blue')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.editReply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.editReply({ content: `<@${target.id}> has been timeouted for **1 Day**`, ephemeral: true});
            }

            if (i.customId === "5") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(604800000, reason).catch(err => {
                    return i.editReply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for **1 Week** || **Reason** ${reason}`).setColor('Blue')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.editReply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.editReply({ content: `<@${target.id}> has been timeouted for **1 Week**`, ephemeral: true});
            }

            
        })

    },
   
  name: 'modpanel', // <--- .setName("modpanel")
  description: 'description', // <-- .setDescription("description")

  options: [
    {
      name: 'target-user',
      description: 'The user to moderatore.',
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'reason',
      description: 'The reason for your action.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
}
