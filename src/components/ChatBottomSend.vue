<template>
  <button class="send-button" @click="handleSend" :disabled="isLoading || !hasInput">发送</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChatStore } from '../store/chatStore'
import { useChatBottomStore } from '../store/ChatBottomStore'
import { ref, watch } from 'vue'

// 组件状态管理
const chatStore = useChatStore() // 初始化聊天状态管理store
const chatBottomStore = useChatBottomStore() // 初始化输入状态管理store
const { isLoading } = storeToRefs(chatStore) // 获取加载状态
const { inputText } = storeToRefs(chatBottomStore) // 获取输入内容
const hasInput = ref(false) // 是否有输入内容

// 监听输入内容变化
watch(inputText, (newContent) => {
  hasInput.value = newContent.trim().length > 0
})

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