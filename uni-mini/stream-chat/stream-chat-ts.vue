<template>
  <view class="chat-container">
    <!-- 聊天展示区域 -->
    <scroll-view class="chat-messages" scroll-y="true">
      <view
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.role]"
      >
        <text class="role">{{ msg.role === 'user' ? '你' : 'AI' }}</text>
        <text class="content">{{ msg.content }}</text>
      </view>
      <view v-if="isLoading" class="loading">AI正在思考中...</view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input
          class="input"
          v-model="inputMessage"
          :disabled="isLoading"
          placeholder="输入消息..."
          @confirm="sendMessage"
      />
      <button :disabled="isLoading" @tap="sendMessage">发送</button>
    </view>

  </view>
</template>

<script lang="ts" setup>
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

let fullResponse = ''
let buffer = ''

const processChunk = (chunk: string) => {
  buffer += chunk
  const chunks = buffer.split('\n')
  buffer = chunks.pop() || ''

  chunks.forEach(trimmedChunk => {
    if (!trimmedChunk || !trimmedChunk.startsWith('data: ')) return

    const jsonString = trimmedChunk.slice(6)
    if (jsonString === '[DONE]') return

    try {
      const data: StreamResponseChunk = JSON.parse(jsonString)

      if (data.usage) {
        usageData.value = data.usage
      }

      const contents = [
        data.choices[0]?.delta?.reasoning_content,
        data.choices[0]?.delta?.content,
      ].filter(Boolean)

      if (contents.length > 0) {
        const output = contents.join('')
        fullResponse += output

        const lastMessage = messages.value[messages.value.length - 1]
        if (lastMessage) {
          lastMessage.content = fullResponse
        }
      }
    } catch (e) {
      console.error('解析错误:', e)
    }
  })
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isLoading.value) return

  try {
    isLoading.value = true
    error.value = ''
    fullResponse = ''

    messages.value.push({
      role: 'user',
      content: inputMessage.value,
    })

    messages.value.push({
      role: 'assistant',
      content: '',
    })

    const task = uni.request({
      url: 'https://maas-api.cn-huabei-1.xf-yun.com/api/v1/chat/completions',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        lora_id: '0'
      },
      data: JSON.stringify({
        model: SERVICE_ID,
        messages: messages.value.slice(0, -1),
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
        stream_options: { include_usage: true },
      }),
      enableChunked: true,
      success(res) {
        if (res.statusCode !== 200) {
          throw new Error(`请求失败: ${res.statusCode}`)
        }
      },
      fail(err) {
        throw new Error(err.errMsg)
      }
    })

    task.onChunkReceived(chunk => {
      processChunk(new TextDecoder().decode(chunk.data))
    })

  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
    if (messages.value.length > 0) {
      messages.value.pop()
    }
  } finally {
    isLoading.value = false
    inputMessage.value = ''
  }
}
</script>

<style lang="scss" scoped>
.chat-container {
  padding: 20rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  border: 1rpx solid #ccc;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.message {
  margin: 20rpx 0;
  padding: 16rpx;
  border-radius: 8rpx;

  .role {
    font-weight: bold;
    margin-bottom: 10rpx;
    display: block;
  }
}

.user {
  background-color: #e3f2fd;
}

.assistant {
  background-color: #f5f5f5;
}

.input-area {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 0;

  .input {
    flex: 1;
    border: 1rpx solid #ccc;
    padding: 16rpx;
    border-radius: 8rpx;
  }

  button {
    background-color: #2196f3;
    color: white;
    padding: 0 40rpx;
    border-radius: 8rpx;
  }

  button[disabled] {
    background-color: #90caf9;
  }
}

.error {
  color: red;
  font-size: 24rpx;
}

.usage {
  background-color: #f8f9fa;
  padding: 20rpx;
  border-radius: 8rpx;

  .title {
    font-weight: bold;
    display: block;
    margin-bottom: 10rpx;
  }
}

.loading {
  color: #666;
  text-align: center;
  padding: 20rpx;
}
</style>
