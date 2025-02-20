// 聊天消息类型定义
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// 流式响应数据块类型定义
export interface StreamResponseChunk {
  id: string
  choices: Array<{
    delta: {
      content?: string
      reasoning_content?: string
    }
    finish_reason?: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// API配置
const API_KEY = 'sk-4et9jiY6FXWulZNX94295c643b52446bA3A04370C9412c44'
const SERVICE_ID = 'xdeepseekv3'

// 流式处理函数
export async function processStream(
  stream: ReadableStream,
  onContent: (content: string) => void,
  onUsage: (usage: StreamResponseChunk['usage']) => void
) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullResponse = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const chunks = buffer.split('\n')
      buffer = chunks.pop() || ''

      for (const chunk of chunks) {
        const trimmedChunk = chunk.trim()
        if (!trimmedChunk || !trimmedChunk.startsWith('data: ')) continue

        const jsonString = trimmedChunk.slice(6)
        if (jsonString === '[DONE]') return

        try {
          const data: StreamResponseChunk = JSON.parse(jsonString)

          // 更新使用数据
          if (data.usage) {
            onUsage(data.usage)
          }

          // 合并内容
          const contents = [
            data.choices[0]?.delta?.reasoning_content,
            data.choices[0]?.delta?.content
          ].filter(Boolean)

          if (contents.length > 0) {
            const output = contents.join('')
            fullResponse += output
            onContent(fullResponse)
          }
        } catch (e) {
          console.error('解析错误:', e)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// 发送流式聊天消息
export async function sendStreamMessage(messages: ChatMessage[]) {
  const response = await fetch('/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'lora_id': '0'
    },
    body: JSON.stringify({
      model: SERVICE_ID,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
      stream_options: { include_usage: true }
    })
  })

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`)
  }

  return response.body
}