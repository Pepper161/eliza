'use server';

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { processMessage } from '../lib/openai';

class DiscordBot {
  private static instance: DiscordBot;
  private client: Client;
  private isReady: boolean = false;

  private constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.setupEventHandlers();
  }

  public static getInstance(): DiscordBot {
    if (!DiscordBot.instance) {
      DiscordBot.instance = new DiscordBot();
    }
    return DiscordBot.instance;
  }

  private setupEventHandlers() {
    this.client.on(Events.ClientReady, () => {
      console.log(`Logged in as ${this.client.user?.tag}`);
      this.isReady = true;
    });

    this.client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;
      
      try {
        const response = await processMessage(message.content);
        await message.reply(response);
      } catch (error) {
        console.error('Error processing message:', error);
        await message.reply('申し訳ありません。エラーが発生しました。');
      }
    });
  }

  public async start() {
    if (!process.env.DISCORD_BOT_TOKEN) {
      throw new Error('DISCORD_BOT_TOKEN is not set in environment variables');
    }

    try {
      await this.client.login(process.env.DISCORD_BOT_TOKEN);
    } catch (error) {
      console.error('Failed to start Discord bot:', error);
      throw error;
    }
  }

  public isInitialized(): boolean {
    return this.isReady;
  }
}

export default DiscordBot;
