import "reflect-metadata";
import { IntentsBitField, Interaction, Message } from "discord.js";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";
import "dotenv/config";

export const client = new Client({
  botId: process.env.BOT_ID,
  botGuilds:
    process.env.NODE_ENV === "development"
      ? [process.env.DEV_GUILD_ID!, "1065620536538972261"]
      : [],
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
  ],
});

client.once("ready", async () => {
  await client.guilds.fetch();
  await client.clearApplicationCommands(...client.guilds.cache.map(g => g.id));
  await client.initApplicationCommands();
  await client.initGlobalApplicationCommands();

  console.log(">> Bot started");
});

client.on("interactionCreate", (interaction: Interaction) => {
  try {
    client.executeInteraction(interaction);
  } catch (err) {
    console.error(err);
  }
});

client.on("messageCreate", (message: Message) => {
  try {
    client.executeCommand(message);
  } catch (err) {
    console.error(err);
  }
});

const run = async () => {
  await importx(
    dirname(import.meta.url) + "/{events,commands,api}/**/*.{ts,js}",
  );

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find `BOT_TOKEN` in your environment");
  }
  await client.login(process.env.BOT_TOKEN);
};

run();
