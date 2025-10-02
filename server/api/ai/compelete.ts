import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export default defineEventHandler(async (event) => {
    //const body = readRawBody(event);
  try {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  });
    const { Readable } = await import('stream');
    const messageStream = Readable.from([completion.choices[0].message.content]);
    return sendStream(event, messageStream);
  } catch (e) {
    console.error("AI error:", e);
    return "Server Error";
  }
})