<h1 align="center">Welcome to tldr bot 👋</h1>
<p>
  <a href="https://github.com/avneesh0612/tldr-bot/blob/main/LICENSE" target="_blank">
    <img alt="License: GPL--3.0" src="https://img.shields.io/badge/License-GPL--3.0-yellow.svg" />
  </a>
  <a href="https://twitter.com/avneesh0612" target="_blank">
    <img alt="Twitter: twitter.com\/avneesh0612" src="https://img.shields.io/twitter/follow/avneesh0612.svg?style=social" />
  </a>
</p>

> TLDRBot is a Discord bot that generates a summary of any conversation. Use the /tldr command to generate a summary of the conversation.


## Using it

The discord bot is self hostable. You can use it by following the steps below:

- Fork the repo
- Create a new application on the [Discord Developer Portal](https://discord.com/developers/applications)
- Create a bot user and copy the token
- Create a `.env` file and add the token as `BOT_TOKEN`
- Copy the client ID and add it in `.env` as `BOT_ID`
- Create a new database on [CockroachDB](https://www.cockroachlabs.com/)
- Paste in the connection string as `DATABASE_URL`
- Run `npx prisma db push && npx prisma generate`
- Create a new API key on [OpenAI](https://platform.openai.com/account/api-keys)
- Paste the key as `OPENAI_API_KEY`

You are now ready to run the bot. You can use `pnpm run dev` to run the bot in development mode or host it!

## Install

```sh
pnpm install
```

## Usage

```sh
pnpm run start
```



## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/avneesh0612/tldr-bot/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2023 [Avneesh Agarwal](https://github.com/avneesh0612).<br />
This project is [GPL--3.0](https://github.com/avneesh0612/tldr-bot/blob/main/LICENSE) licensed.
