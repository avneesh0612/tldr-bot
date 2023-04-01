import { ChatInputCommandInteraction, Message, MessageType } from "discord.js";

export const fetchMessages = async ({
  interaction,
  limit,
  after,
  before,
  around,
}: {
  interaction: ChatInputCommandInteraction;
  limit: number;
  after?: string;
  before?: string;
  around?: string;
}) => {
  if (interaction.channel) {
    // @ts-ignore
    const messages = await interaction.channel.messages.fetch({
      cache: false,
      limit,
      ...(after && { after }),
      ...(before && { before }),
      ...(around && { around }),
    });

    const fetchedMessages = messages
      .toJSON()
      .reverse()
      .map((message: Message) => {
        const updatedMessageContent = message.content.replace(
          /<a?:\w+:\d+>/g,
          "",
        );

        if (updatedMessageContent === "") {
          return "";
        }
        return `${
          message.member?.nickname || message.author.username
        } (Message ID - ${message.id}) ${
          message.type == MessageType.Reply &&
          `replied to message ID ${message.reference?.messageId}`
        } and said: ${updatedMessageContent}`;
      });

    return fetchedMessages;
  }
};
