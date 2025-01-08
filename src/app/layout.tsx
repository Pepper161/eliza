import Providers from '../app/providers';
import './globals.css';
import DiscordBot from '@/lib/discord';

export const metadata = {
  title: 'Eliza AI Chat',
  description: 'AI Chat Agent Hosting Service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Discord bot in production only
  if (process.env.NODE_ENV === 'production') {
    try {
      const bot = DiscordBot.getInstance();
      bot.start().catch(console.error);
    } catch (error) {
      console.error('Failed to initialize Discord bot:', error);
    }
  }

  return (
    <html lang="ja">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
