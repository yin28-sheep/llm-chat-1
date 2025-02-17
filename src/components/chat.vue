<template>
  <div class="container">
    <h1>DeepSeek-R1</h1>
    <div class="chat-log" ref="chatLogRef">
      <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="message.role === 'user' ? 'user-message' : 'ai-message'"
      >
        {{ message.content }}
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
  if (!message) return

  // 添加用户消息
  addMessage({
    role: 'user',
    content: message
  })
  inputText.value = ''

  try {
    const response = await fetch('https://api.chatanywhere.com.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
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
    // 可以在这里添加错误处理逻辑
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
  margin-bottom: 20px;
  overflow-y: scroll;
  max-height: 300px;
  padding-right: 10px;
  border-right: 1px solid #ccc;
}

.user-message {
  background-color: #f5f5f5;
  color: #333;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.ai-message {
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
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
</style>