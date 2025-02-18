<template>
  <div class="container">
    <h1>DeepSeek-V3</h1>
    <div class="chat-log" ref="chatLogRef">
      <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="['message-bubble', message.role === 'user' ? 'user-message' : 'ai-message']"
      >
        <pre>{{ message.content }}</pre>
      </div>
    </div>
    <div class="input-container">
      <input
          v-model="inputText"
          class="input"
          placeholder="请输入消息"
          @keyup.enter="sendMessage"
      />
      <button class="send-button" @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

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

const inputText = ref('')
const chatMessages = ref<Message[]>([])
const chatLogRef = ref<HTMLElement | null>(null)
const isLoading = ref(false)

const addMessage = (message: Message) => {
  chatMessages.value.push(message)
  nextTick(() => {
    if (chatLogRef.value) {
      chatLogRef.value.scrollTop = chatLogRef.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  const message = inputText.value.trim()
  if (!message || isLoading.value) return

  isLoading.value = true
  // 添加用户消息
  addMessage({
    role: 'user',
    content: message
  })
  inputText.value = ''

  try {
    const response = await fetch('https://maas-api.cn-huabei-1.xf-yun.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'sk-4et9jiY6FXWulZNX94295c643b52446bA3A04370C9412c44',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "xdeepseekv3",
        messages: chatMessages.value.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data: ChatGPTResponse = await response.json()
    const reply = data.choices[0].message.content

    // 添加AI回复
    addMessage({
      role: 'assistant',
      content: reply
    })

  } catch (error) {
    console.error('请求失败:', error)
    addMessage({
      role: 'assistant',
      content: '请求失败，请稍后再试'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 保持原有样式不变 */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.container {
  max-width: 1000px;
  height: 700px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.chat-log {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 15px;
  word-break: break-word;
}

.user-message {
  background: #e8f4ff;
  align-self: flex-end;
}

.ai-message {
  background: #f5f5f5;
  align-self: flex-start;
}

pre {
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
}

.input-container {
  display: flex;
  align-items: center;
}

.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 修改发送按钮禁用状态 */
.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>