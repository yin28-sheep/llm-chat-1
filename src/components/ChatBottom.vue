// 聊天输入组件：负责用户消息的输入和发送功能
<template>
  <div class="chat-bottom">
    <!-- 消息输入区域 -->
    <div class="input-container">
      <chat-bottomln @send="handleSend" />
      <chat-bottom-send @send="handleSend" />
    </div>
    <chat-bottom-date :usage-data="messageRef?.usageData" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChatBottomStore } from '../store/ChatBottomStore'
import { useChatStore } from '../store/chatStore'
import ChatBottomln from './ChatBottomln.vue'
import ChatBottomDate from './ChatBottomDate.vue'
import ChatBottomSend from './ChatBottomSend.vue'

// 初始化store
const chatBottomStore = useChatBottomStore()
const chatStore = useChatStore()

// 获取状态和方法
const { messageRef } = storeToRefs(chatBottomStore)
const { messages } = storeToRefs(chatStore)
const { addMessage, setLoading } = chatStore

// 处理发送消息
const handleSend = () => {
  chatBottomStore.sendMessage(
    messages.value,
    addMessage,
    setLoading,
    () => emit('scroll')
  )
}

// 定义组件事件
const emit = defineEmits(['scroll'])
</script>

<style scoped>
@import '@/styles/chatBottom.css';
</style>