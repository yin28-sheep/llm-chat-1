// 聊天消息显示组件：负责渲染和管理聊天消息列表
<template>
  <!-- 聊天记录显示区域，使用ref获取DOM元素用于滚动控制 -->
  <div class="chat-log" ref="chatLogRef">
    <!-- 遍历显示聊天消息，根据角色使用不同的子组件 -->
    <template v-for="(message, index) in chatMessages" :key="index">
      <chat-message-user v-if="message.role === 'user'" :message="message" />
      <chat-message-chat v-else :message="message" />
    </template>
    <!-- 加载状态提示 -->
    <div v-if="isLoading" class="loading">AI正在思考中...</div> 
  </div> 
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../store/chatStore'
import ChatMessageUser from './ChatMessageUser.vue'
import ChatMessageChat from './ChatMessageChat.vue'

// 组件状态管理
const chatLogRef = ref<HTMLElement | null>(null) // 聊天记录容器引用
const chatStore = useChatStore() // 初始化聊天状态管理store
const { messages: chatMessages, isLoading } = storeToRefs(chatStore) // 获取聊天消息列表和加载状态

// 滚动到聊天记录底部的方法
// 使用nextTick确保DOM更新后再执行滚动
const scrollToBottom = () => {
  nextTick(() => {
    if (chatLogRef.value) {
      chatLogRef.value.scrollTop = chatLogRef.value.scrollHeight
    }
  })
}

// 监听消息列表变化，自动滚动到底部
watch(chatMessages, () => {
  scrollToBottom()
}, { deep: true }) // 添加deep选项以监听消息内容的变化

// 监听加载状态变化，当加载完成时滚动到底部
watch(isLoading, (newValue) => {
  if (!newValue) {
    scrollToBottom()
  }
})

// 暴露方法给父组件
defineExpose({
  scrollToBottom
})
</script>

<style scoped>
@import '@/styles/ChatMessage.css';
</style>