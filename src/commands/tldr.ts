import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { fetchMessages, generateTLDR } from "@/utils";

import { blacklistedEmbed, errorEmbed } from "@/embeds";
import { getServer } from "@/controllers";

const InputTransformer = (numberOfMessages: string): number => {
  return numberOfMessages ? parseInt(numberOfMessages) : 50;
};

@Discord()
export class Tldr {
  @Slash({ description: "get the TLDR; of a conversation", name: "tldr" })
  async tldr(
    @SlashOption({
      description: "Number of messages to get TLDR; from",
      name: "number-of-messages",
      required: false,
      transformer: InputTransformer,
      type: ApplicationCommandOptionType.Number,
    })
    @SlashOption({
      description: "After which message to get TLDR; from",
      name: "after",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    @SlashOption({
      description: "Before which message to get TLDR; from",
      name: "before",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    @SlashOption({
      description: "Around which message to get TLDR; from",
      name: "around",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    @SlashOption({
      description: "Give TLDR in bullet points",
      name: "bullet-points",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    })
    numberOfMessages: number,
    after: string,
    before: string,
    around: string,
    bulletPoints: boolean,
    interaction: ChatInputCommandInteraction,
  ) {
    if (interaction.channel) {
      try {
        if (numberOfMessages > 100) {
          return interaction.reply("Max 100 messages");
        }

        await interaction.deferReply();

        const messages = await fetchMessages({
          interaction,
          limit: numberOfMessages,
          after,
          before,
          around,
        });
        const server = await getServer(interaction.guildId!);

        if (server.blacklisted_members.includes(interaction.user.id)) {
          return await interaction.editReply({
            embeds: blacklistedEmbed(),
          });
        }

        const messagesContentString = messages!.join("\n");

        const tldr = await generateTLDR(messagesContentString, bulletPoints);
        console.log(tldr);

        if (tldr.err) {
          if (
            tldr.err.message.includes("Request failed with status code 429")
          ) {
            return interaction.editReply(
              errorEmbed("Open AI rate limit reached"),
            );
          }
        }

        if (tldr.tldr) {
          return interaction.editReply({
            embeds: [
              {
                color: 0x35dce7,
                title: "TLDR",
                description: tldr.tldr,
              },
            ],
          });
        }

        return interaction.editReply(errorEmbed());
      } catch (error) {
        return interaction.editReply(errorEmbed());
      }
    }

    return interaction.reply("Please use this command in a server");
  }
}
