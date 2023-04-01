import {
  ActionRowBuilder,
  CommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { Discord, SelectMenuComponent, Slash } from "discordx";
import { client } from "..";

const options: Array<{
  label: string;
  value: string;
  options: {
    name: string;
    description: string;
  }[];
}> = [];
const commands = client.applicationCommandSlashes;

let initiatorId = "";

@Discord()
export class Help {
  @Slash({
    name: "help",
    description: "List of all the commands",
  })
  async help(interaction: CommandInteraction) {
    await interaction.deferReply();

    initiatorId = interaction.user.id;

    for await (const command of commands) {
      options.push({
        label: command.name,
        value: command.description,
        options: command.options,
      });
    }

    const menu = new StringSelectMenuBuilder()
      .addOptions(options)
      .setCustomId("command-menu");

    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        menu,
      );

    return interaction.editReply({
      components: [buttonRow],
      embeds: [
        {
          title: "Help",
          description:
            "TLDR Bot is a bot that helps you get the gist of a long message.",
          color: 0x35dce7,
          fields: [
            {
              name: "Commands",
              value: options
                .map(r => `- **${r.label}**: ${r.value}`)
                .join("\n"),
            },
          ],
        },
      ],
    });
  }

  @SelectMenuComponent({
    id: "command-menu",
  })
  async handle(interactionSelect: StringSelectMenuInteraction) {
    if (initiatorId !== interactionSelect.user.id) {
      return interactionSelect.reply({
        content: "You are not the one who initiated this",
        ephemeral: true,
      });
    }

    await interactionSelect.deferReply();

    const input = interactionSelect.values[0];
    const command = options.find(r => r.value === input);

    if (!input || !command) {
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(command.label)
      .setDescription(command.value)
      .setFields(
        command.options.length > 0
          ? [
              {
                name: "Options",
                value: command.options
                  .map(r => `- **${r.name}**: ${r.description}`)
                  .join("\n"),
              },
            ]
          : [],
      );

    return interactionSelect.followUp({
      embeds: [embed],
      ephemeral: true,
    });
  }
}
