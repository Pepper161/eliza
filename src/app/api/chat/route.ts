import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const completion = await openai.chat.completions.create({
      model: process.env.XAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages
      ],
    });

    return NextResponse.json({ 
      message: completion.choices[0].message 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
}
