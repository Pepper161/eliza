import Providers from '../app/providers';
import './globals.css';

export const metadata = {
  title: 'Eliza AI Chat',
  description: 'AI Chat Agent Hosting Service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
