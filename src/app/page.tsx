import Chat from '../components/Chat';

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Eliza AI Chat</h1>
      <Chat />
    </main>
  );
}
