<template>
  <div class="sidebar">
    <Tools />
    <CreateMessage />
    <div class="history-list">
      <div v-for="(message, index) in chatMessages" 
           :key="index"
           class="history-item"
           :class="{ 'active': currentMessageIndex === index }"
           @click="selectMessage(index)">
        <span class="message-preview">{{ getMessagePreview(message.content) }}</span>
        <span class="message-time">{{ message.role === 'user' ? '我' : 'AI' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '../store/chat'
import Tools from './Tools.vue'
import CreateMessage from './CreateMessage.vue'

const { messages: chatMessages } = useChatStore()
const currentMessageIndex = ref(-1)

const selectMessage = (index: number) => {
  currentMessageIndex.value = index
}

const getMessagePreview = (content: string) => {
  return content.length > 30 ? content.substring(0, 30) + '...' : content
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.history-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-item:hover {
  background-color: #f8f8f8;
}

.history-item.active {
  background-color: #e8f4ff;
}

.message-preview {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}
</style>