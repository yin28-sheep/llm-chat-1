<template>
  <div class="chat-container">
    <!-- 文件上传区域 -->
    <div class="upload-section">
      <input accept="*/*" type="file" @change="handleFileUpload" />
      <button @click="clearChat">清除对话</button>
    </div>

    <!-- 聊天展示区域 -->
    <div class="chat-display">
      <div v-for="(msg, index) in chatHistory" :key="index" class="message">
        <div class="role">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
        <div class="content">
          <template v-if="msg.type === 'text'">{{ msg.content }}</template>
          <img
              v-else-if="msg.type === 'image'"
              :src="msg.content"
              class="uploaded-image"
          />
        </div>
      </div>
      <div v-if="loading" class="loading-indicator">AI正在思考中...</div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type MessageContent =
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }

interface ChatMessage {
  role: 'user' | 'assistant'
  type: 'text' | 'image'
  content: string
}

// 增加类型定义（补充到原有类型定义处）
interface ChatCompletionParams {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: MessageContent[]
  }>
  stream: boolean
  temperature?: number
  max_tokens?: number
}

// 响应式数据
const apiKey = ref('d142a50bca104bc8bd2fb900ee04137d.GH1ZcH38jyiXdkrt') // 建议从安全存储获取
const userInput = ref('')
const loading = ref(false)
const error = ref('')
const chatHistory = ref<ChatMessage[]>([])
const currentImage = ref<string>()
const DEFAULT_PROMPT = '解析一下这张图片' // 新增默认提示词

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      currentImage.value = e.target?.result as string
      chatHistory.value.push({
        role: 'user',
        type: 'image',
        content: currentImage.value,
      })
      sendMessage() // 自动触发发送
    }
    reader.readAsDataURL(file)
  }
}

// 修正后的buildRequestParams函数
const buildRequestParams = (): ChatCompletionParams => {
  const content: MessageContent[] = []

  // 添加图片消息（修正参数结构）
  if (currentImage.value) {
    content.push({
      type: 'image_url',
      image_url: {
        url: currentImage.value, // 直接使用base64数据，需要包含data:前缀
      },
    })
  }

  // 固定添加默认提示词
  content.push({
    type: 'text',
    text: DEFAULT_PROMPT,
  })

  return {
    model: 'glm-4v-plus-0111',
    messages: [
      {
        role: 'user',
        content: content,
      },
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 1000,
  }
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() && !currentImage.value) return
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    const response = await fetch(
        'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey.value}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(buildRequestParams()),
        }
    )

    if (!response.ok) throw new Error(`请求失败: ${response.status}`)
    if (!response.body) throw new Error('空响应体')

    // 处理流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let aiResponse = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const chunks = buffer.split('\n')
      buffer = chunks.pop() || ''

      for (const chunk of chunks) {
        const trimmed = chunk.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue

        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6)
          try {
            const data = JSON.parse(jsonStr)
            const content = data.choices[0]?.delta?.content || ''
            if (content) {
              aiResponse += content
              updateAIResponse(aiResponse)
            }
          } catch (e) {
            console.error('解析错误:', e)
          }
        }
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '请求发生错误'
  } finally {
    loading.value = false
    userInput.value = ''
    currentImage.value = undefined
  }
}

// 更新AI响应
const updateAIResponse = (content: string) => {
  const lastMessage = chatHistory.value[chatHistory.value.length - 1]
  if (lastMessage?.role === 'assistant') {
    lastMessage.content = content
  } else {
    chatHistory.value.push({
      role: 'assistant',
      type: 'text',
      content: content,
    })
  }
}

// 清除对话
const clearChat = () => {
  chatHistory.value = []
  currentImage.value = undefined
}
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.upload-section {
  margin-bottom: 20px;
}

.chat-display {
  border: 1px solid #ccc;
  min-height: 4px;
  max-height: 60px;
  overflow-y: auto;
  padding: 15px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 15px;
}

.role {
  font-weight: bold;
  color: #666;
}

.uploaded-image {
  max-width: 300px;
  max-height: 200px;
  margin: 10px 0;
}

textarea {
  flex: 1;
  height: 80px;
  padding: 10px;
}

button {
  padding: 8px 15px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
}

.loading-indicator {
  color: #666;
  font-style: italic;
}

.error-message {
  color: #dc3545;
}

</style>
