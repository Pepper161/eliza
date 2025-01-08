import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function processMessage(content: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.XAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: content }
      ],
    });

    return completion.choices[0].message.content || '応答を生成できませんでした。';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

export default openai;
