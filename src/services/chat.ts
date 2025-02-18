interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatGPTResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

export async function sendChatMessage(messages: Message[]): Promise<string> {
  try {
    const response = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "xdeepseekv3",
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data: ChatGPTResponse = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}