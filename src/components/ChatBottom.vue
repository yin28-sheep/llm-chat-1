// 聊天输入组件：负责用户消息的输入和发送功能
<template>
  <div class="chat-bottom">
    <!-- 消息输入区域 -->
    <div class="input-container">
      <chat-bottomln @send="handleSend" />
      <chat-bottom-send @send="handleSend" />
    </div>
    <chat-bottom-date :usage-data="usageData" />
  </div>
</template>

<script setup lang="ts">
import { useSendStore } from '../store/SendStore'
import ChatBottomln from './ChatBottomln.vue'
import ChatBottomSend from './ChatBottomSend.vue'
import { computed } from 'vue'

// 初始化store
const sendStore = useSendStore()

// 获取状态和方法
const usageData = computed(() => sendStore.usageData)
// 处理发送消息
const handleSend = async () => {
  await sendStore.sendMessage()
  emit('scroll')
}

// 定义组件事件
const emit = defineEmits(['scroll'])
</script>

<style scoped>
@import '@/styles/chatBottom.css';
</style>