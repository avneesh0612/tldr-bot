export const errorEmbed = (err?: string) => {
  return {
    embeds: [
      {
        color: 0xdc0000,
        title: "TLDR",
        description: err || "Something went wrong",
      },
    ],
  };
};
