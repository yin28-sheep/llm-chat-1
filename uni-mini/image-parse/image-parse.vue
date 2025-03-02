<template>
  <view class="chat-container">
    <!-- 文件上传区域 -->
    <view class="upload-section">
      <button @click="handleFileUpload">选择文件</button>
      <button @click="clearChat">清除对话</button>
    </view>

    <!-- 聊天展示区域 -->
    <scroll-view class="chat-display" scroll-y>
      <view v-for="(msg, index) in chatHistory" :key="index" class="message">
        <view class="role">{{ msg.role === 'user' ? '我' : 'AI' }}</view>
        <view class="content">
          <text v-if="msg.type === 'text'">{{ msg.content }}</text>
          <image
              v-else-if="msg.type === 'image'"
              :src="msg.content"
              class="uploaded-image"
              mode="widthFix"
          />
        </view>
      </view>
      <view v-if="loading" class="loading-indicator">AI正在思考中...</view>
      <view v-if="error" class="error-message">{{ error }}</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const apiKey = ref('d142a50bca104bc8bd2fb900ee04137d.GH1ZcH38jyiXdkrt')
const loading = ref(false)
const error = ref('')
const chatHistory = ref([])
const currentImage = ref()
const DEFAULT_PROMPT = '解析一下这张图片'
// 新增默认回复相关变量
const defaultResponse = '你说得对，但是Rust是由Mozilla自主研发的一款全新内存安全编程语言。编译将发生在一个被称作「卡尔构」的构建系统，在这里，被引用的指针将被授予「生命周期」，导引安全之力。你将扮演一位名为「开发者」的神秘角色在编程的搏斗中邂逅骨骼惊奇的报错，绕开它们通过编译同时，逐步发掘「Rust」的真相。\n' +
    '这是什么？unsafe？编译一下。这是什么？unsafe？编译一下。这是什么？unsafe？编译一下。这是什么？unsafe？编译一下。这是什么？unsafe？编译一下。这是什么？unsafe？编译一下'
let responseInterval = null

const handleFileUpload = () => {
  try {
    currentImage.value = '/static/logo.png'
    chatHistory.value.push({
      role: 'user',
      type: 'image',
      content: currentImage.value
    })
    sendMessage()
  } catch (err) {
    error.value = '加载默认图片失败'
  }
}

// 新增伪装流式响应方法
const fakeStreamResponse = () => {
  let charIndex = 0
  let tempResponse = ''

  // 先添加空消息
  chatHistory.value.push({
    role: 'assistant',
    type: 'text',
    content: ''
  })

  responseInterval = setInterval(() => {
    if (charIndex < defaultResponse.length) {
      tempResponse += defaultResponse[charIndex]
      const lastMsg = chatHistory.value[chatHistory.value.length - 1]
      lastMsg.content = tempResponse
      charIndex++
    } else {
      clearInterval(responseInterval)
    }
  }, 100) // 每个字符间隔100毫秒
}

const sendMessage = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    // 先启动伪装流式响应
    fakeStreamResponse()

    // 原始API请求保持不动
    const response = await uni.request({
      url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      method: 'POST',
      header: {
        Authorization: `Bearer ${apiKey.value}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(bRPs())
    })

    if (response.statusCode !== 200) {
      throw new Error(`请求失败: ${response.statusCode}`)
    }

    // 如果收到真实响应，清除伪装流式
    clearInterval(responseInterval)

    // 处理真实响应...
    let aiResponse = ''
    const data = response.data
    if (data.choices && data.choices.length > 0) {
      aiResponse = data.choices[0].message.content
      updateAIResponse(aiResponse)
    }

  } catch (err) {
    error.value = err.message || '请求发生错误'
    // 请求失败时保持伪装流式结果
  } finally {
    loading.value = false
    currentImage.value = null
  }
}

// 其他方法保持不变...

const updateAIResponse = (content) => {
  const lastMessage = chatHistory.value[chatHistory.value.length - 1]
  if (lastMessage && lastMessage.role === 'assistant') {
    lastMessage.content = content
  } else {
    chatHistory.value.push({
      role: 'assistant',
      type: 'text',
      content: content
    })
  }
}

const clearChat = () => {
  chatHistory.value = []
  currentImage.value = null
}
</script>

<style scoped>
.chat-container {
  padding: 20rpx;
}

.upload-section {
  margin-bottom: 20rpx;
  display: flex;
  gap: 20rpx;
}

.chat-display {
  height: 80vh;
  border: 1rpx solid #ccc;
  padding: 15rpx;
}

.message {
  margin-bottom: 30rpx;
}

.role {
  font-weight: bold;
  color: #666;
  margin-bottom: 10rpx;
}

.uploaded-image {
  max-width: 300rpx;
  margin: 20rpx 0;
}

button {
  padding: 15rpx 30rpx;
  background: #007bff;
  color: white;
  border-radius: 8rpx;
}

.loading-indicator {
  color: #666;
  font-style: italic;
}

.error-message {
  color: #dc3545;
}
</style>
