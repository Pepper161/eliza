import { NextResponse } from 'next/server';
import DiscordBot from '@/lib/discord';

export async function GET() {
  try {
    const bot = DiscordBot.getInstance();
    if (!bot.isInitialized()) {
      await bot.start();
    }
    return NextResponse.json({ status: 'Discord bot is running' });
  } catch (error) {
    console.error('Failed to start Discord bot:', error);
    return NextResponse.json({ error: 'Failed to start Discord bot' }, { status: 500 });
  }
}
