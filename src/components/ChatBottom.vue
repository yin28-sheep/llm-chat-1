// 聊天输入组件：负责用户消息的输入和发送功能
<template>
  <!-- 消息输入区域 -->
  <div class="input-container">
    <input
      v-model="inputText"
      class="input"
      placeholder="请输入消息"
      @keyup.enter="sendMessage"
      :disabled="isLoading"
    />
    <button class="send-button" @click="sendMessage" :disabled="isLoading">发送</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../store/chatStore'
import { sendStreamMessage, processStream } from '../services/chat'

// 组件状态管理
const inputText = ref('') // 输入框文本状态
const chatStore = useChatStore() // 初始化聊天状态管理store
const { isLoading } = storeToRefs(chatStore) // 解构获取消息列表和加载状态
const { addMessage } = chatStore // 获取添加消息方法
const messageRef = ref<{ usageData: any } | null>(null) // 添加messageRef引用

// 发送消息处理函数
// 处理用户消息发送，包括：
// 1. 消息验证
// 2. 更新UI状态
// 3. 发送消息到服务器并处理流式响应
// 4. 错误处理
const sendMessage = async () => {
  const message = inputText.value.trim()
  if (!message || isLoading.value) return

  chatStore.setLoading(true) // 设置加载状态
  inputText.value = '' // 清空输入框

  try {
    // 添加用户消息
    addMessage({
      role: 'user',
      content: message
    })

    // 添加初始AI消息
    addMessage({
      role: 'assistant',
      content: ''
    })

    // 获取消息历史
    const messageHistory = chatStore.messages
 
    // 发送消息并获取流式响应
    const stream = await sendStreamMessage(messageHistory.slice(0, -1))
    if (stream) {
      await processStream(
        stream,
        (content) => {
          // 更新最后一条消息内容
          const lastMessage = messageHistory[messageHistory.length - 1]
          if (lastMessage) {
            lastMessage.content = content
          }
        },
        (usage) => {
          // 更新使用统计数据
          if (messageRef.value) {
            messageRef.value.usageData = usage
          }
        }
      )
    }
    emit('scroll') // 触发滚动事件
  } catch (error) {
    console.error('发送消息失败:', error)
    // 移除空的AI消息
    chatStore.messages.pop()
    // 错误处理：显示错误提示消息
    addMessage({
      role: 'assistant',
      content: '请求失败，请稍后再试'
    })
  } finally {
    chatStore.setLoading(false) // 重置加载状态
  }
}

// 定义组件事件
const emit = defineEmits(['scroll']) // 定义scroll事件用于通知父组件进行滚动
</script>

<style scoped>
@import '@/styles/chatBottom.css';
</style>