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

// 发送聊天消息到服务器并获取AI回复
export async function sendChatMessage(messages: Message[]): Promise<string> {
  try {
    // 发送POST请求到API端点
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

    // 检查响应状态
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    // 解析响应数据并返回AI回复内容
    const data: ChatGPTResponse = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    // 错误处理和日志记录
    console.error('请求失败:', error)
    throw error
  }
}