<template>
  <div class="input-area">
    <input
      v-model="inputStore.inputText"
      class="message-input"
      placeholder="请输入内容..."
      :disabled="messageStore.isLoading"
      @keyup.enter="handleSend"
    />
    <chat-bottom-send @send="handleSend" />
  </div>
</template>

<script setup lang="ts">
import ChatBottomSend from './ChatBottomSend.vue'
import { useInputStore } from '../store/InputStore'
import { useMessageStore } from '../store/MessageStore'

// 初始化store
const inputStore = useInputStore()
const messageStore = useMessageStore()

// 定义事件
const emit = defineEmits(['send'])

// 处理发送消息
const handleSend = async () => {
  const message = inputStore.inputText.trim()
  if (!message || messageStore.isLoading) return
  
  // 触发send事件并传递消息内容，让父组件处理发送逻辑，避免重复发送
  emit('send', message)
}
</script>

<style scoped>
@import'@/styles/InlineDialog.css'
</style>