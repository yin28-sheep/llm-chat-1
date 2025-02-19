import { streamChatCompletion } from '../utils/openAI-wheel.ts'
const API_KEY = import.meta.env.VITE_API_KEY // 建议通过环境变量配置

export async function* streamChatResponse(messages: Message[]): AsyncGenerator<string> {
  const stream = streamChatCompletion(API_KEY, {
    model: "xdeepseekv3",
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: true,
    temperature: 0.7,
    extra_headers: { lora_id: '0' }
  });

  for await (const chunk of stream) {
    yield chunk.choices[0]?.delta?.content || '';
  }
} 