<template>
  <button class="send-button" @click="handleSend" :disabled="isLoading">发送</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChatStore } from '../store/chatStore'

// 组件状态管理
const chatStore = useChatStore() // 初始化聊天状态管理store
const { isLoading } = storeToRefs(chatStore) // 获取加载状态

// 定义事件
const emit = defineEmits(['send'])

// 处理发送事件
const handleSend = () => {
  if (isLoading.value) return
  emit('send')
}
</script>

<style scoped>
@import'@/styles/chatBottomSend.css'
</style>