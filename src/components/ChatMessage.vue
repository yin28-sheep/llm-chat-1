// 聊天消息显示组件：负责渲染和管理聊天消息列表
<template>
  <!-- 聊天记录显示区域，使用ref获取DOM元素用于滚动控制 -->
  <div class="chat-log" ref="chatLogRef">
    <!-- 遍历显示聊天消息，根据角色应用不同样式 -->
    <div
      v-for="(message, index) in chatMessages"
      :key="index"
      :class="['message-bubble', message.role === 'user' ? 'user-message' : 'ai-message']"
    >
      <pre>{{ message.content }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../store/chatStore'

// 组件状态管理
const chatLogRef = ref<HTMLElement | null>(null) // 聊天记录容器引用
const chatStore = useChatStore() // 初始化聊天状态管理store
const { messages: chatMessages } = storeToRefs(chatStore) // 获取聊天消息列表

// 滚动到聊天记录底部的方法
// 使用nextTick确保DOM更新后再执行滚动
const scrollToBottom = () => {
  nextTick(() => {
    if (chatLogRef.value) {
      chatLogRef.value.scrollTop = chatLogRef.value.scrollHeight
    }
  })
}

// 暴露方法给父组件
defineExpose({
  scrollToBottom
})
</script>

<style scoped>
@import '@/styles/ChatMessage.css';
</style>