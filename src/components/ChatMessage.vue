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
.chat-log {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  margin-bottom: 10px;
  height: 0;
  min-height: 0;
}

.message-bubble {
  padding: 12px;
  border-radius: 8px;
  max-width: 80%;
  word-break: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.ai-message {
  align-self: flex-start;
  background-color: #f8f9fa;
  color: #333;
}

.message-bubble pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
}
</style>