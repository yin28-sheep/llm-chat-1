<template>
  <div class="chat-container">
    <!-- 聊天展示区域 -->
    <div class="chat-messages">
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
        <div class="role">{{ msg.role === 'user' ? 'You' : 'AI' }}</div>
        <div class="content">{{ msg.content }}</div>
      </div>
      <div v-if="isLoading" class="loading">AI正在思考中...</div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
        :disabled="isLoading"
      />
      <button @click="sendMessage" :disabled="isLoading">发送</button>
    </div>

    <!-- 状态信息 -->
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="usageData" class="usage">
      <h3>资源使用统计</h3>
      <p>输入Token: {{ usageData.prompt_tokens }}</p>
      <p>输出Token: {{ usageData.completion_tokens }}</p>
      <p>总计Token: {{ usageData.total_tokens }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface StreamResponseChunk {
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

const API_KEY = 'sk-4et9jiY6FXWulZNX94295c643b52446bA3A04370C9412c44'
const SERVICE_ID = 'xdeepseekv3'

// 响应式数据
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const error = ref('')
const usageData = ref<StreamResponseChunk['usage'] | null>(null)

// 流式处理函数
async function processStream(stream: ReadableStream) {
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
            usageData.value = data.usage
          }

          // 合并内容
          const contents = [
            data.choices[0]?.delta?.reasoning_content,
            data.choices[0]?.delta?.content
          ].filter(Boolean)

          if (contents.length > 0) {
            const output = contents.join('')
            fullResponse += output

            // 更新最后一条消息内容
            const lastMessage = messages.value[messages.value.length - 1]
            if (lastMessage) {
              lastMessage.content = fullResponse
            }
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

async function sendMessage() {
  if (!inputMessage.value.trim() || isLoading.value) return

  try {
    isLoading.value = true
    error.value = ''

    // 添加用户消息
    messages.value.push({
      role: 'user',
      content: inputMessage.value
    })

    // 添加初始AI消息
    messages.value.push({
      role: 'assistant',
      content: ''
    })

    const response = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'lora_id': '0'
      },
      body: JSON.stringify({
        model: SERVICE_ID,
        messages: messages.value.slice(0, -1), // 排除当前的空AI消息
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
        stream_options: { include_usage: true }
      })
    })

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }

    if (response.body) {
      await processStream(response.body)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
    // 移除空的AI消息
    if (messages.value.length > 0) {
      messages.value.pop()
    }
  } finally {
    isLoading.value = false
    inputMessage.value = ''
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.chat-messages {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  min-height: 300px;
}

.message {
  margin: 10px 0;
  padding: 8px;
  border-radius: 4px;
}

.message.user {
  background-color: #e3f2fd;
}

.message.assistant {
  background-color: #f5f5f5;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px;
}

button {
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}

.usage {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>
