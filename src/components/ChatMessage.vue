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
      <div class="role">{{ message.role === 'user' ? 'You' : 'AI' }}</div>
      <pre>{{ message.content }}</pre>
    </div>
    <!-- 加载状态提示 -->
    <div v-if="isLoading" class="loading">AI正在思考中...</div>
    <!-- 资源使用统计 -->
    <!-- <div v-if="usageData" class="usage">
      <h3>资源使用统计</h3>
      <p>输入Token: {{ usageData.prompt_tokens }}</p>
      <p>输出Token: {{ usageData.completion_tokens }}</p>
      <p>总计Token: {{ usageData.total_tokens }}</p>
    </div>-->
  </div> 
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../store/chatStore'
// import type { StreamResponseChunk } from '../services/chat'

// 组件状态管理
const chatLogRef = ref<HTMLElement | null>(null) // 聊天记录容器引用
const chatStore = useChatStore() // 初始化聊天状态管理store
const { messages: chatMessages, isLoading } = storeToRefs(chatStore) // 获取聊天消息列表和加载状态
// const usageData = ref<StreamResponseChunk['usage'] | null>(null) // 资源使用统计数据

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