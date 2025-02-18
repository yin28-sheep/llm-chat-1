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
const chatStore = useChatStore()
const { messages: chatMessages } = storeToRefs(chatStore)

// 滚动到聊天记录底部
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
/* 聊天记录区域样式 */
.chat-log {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  margin-bottom: 10px;
}

/* 消息气泡通用样式 */
.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 15px;
  word-break: break-word;
}

/* 用户消息样式 */
.user-message {
  background: #e8f4ff;
  align-self: flex-end;
}

/* AI消息样式 */
.ai-message {
  background: #f5f5f5;
  align-self: flex-start;
}

/* 消息文本样式 */
pre {
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
}
</style>