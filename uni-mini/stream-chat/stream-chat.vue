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

<script setup>
import {ref} from 'vue'

const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
let responseTimer = null

// 模拟流式响应
const fakeStreamResponse = () => {
  const defaultResponse = '你好啊！在这漫长的时光河流中，每一次问候都如同温柔的涟漪，轻轻地触动着彼此的心灵。无论是晨曦初照，还是夜幕低垂，一句简单的“你好”总能拉近人与人之间的距离，传递出温暖与关怀。在这个瞬息万变的世界里，愿我们的每一次相遇都能以这样温馨的问候开始，共同编织出更多美好的回忆和故事。那么，今天你有什么特别的计划或者想要分享的事情吗？'
  let charIndex = 0

  // 先添加空消息
  messages.value.push({
    role: 'assistant',
    content: ''
  })

  // 逐字添加效果
  responseTimer = setInterval(() => {
    if (charIndex < defaultResponse.length) {
      const lastMsg = messages.value[messages.value.length - 1]
      lastMsg.content += defaultResponse[charIndex]
      charIndex++
    } else {
      clearInterval(responseTimer)
    }
  }, 100) // 每个字符间隔100ms
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isLoading.value) return

  try {
    isLoading.value = true

    // 添加用户消息
    messages.value.push({
      role: 'user',
      content: inputMessage.value,
    })

    // 开始模拟响应
    fakeStreamResponse()

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

.loading {
  color: #666;
  text-align: center;
  padding: 20rpx;
}
</style>
