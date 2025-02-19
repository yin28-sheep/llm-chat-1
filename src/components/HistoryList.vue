<template>
  <div class="history-list">
    <history-list-chat
      v-for="session in chatSessions"
      :key="session.id"
      :session="session"
      :is-active="currentSessionId === session.id"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCreateMessageStore } from '../store/CreateMessageStore'
import HistoryListChat from './HistoryListChat.vue'

const store = useCreateMessageStore()
const { chatSessions, currentSessionId } = storeToRefs(store)

</script>

<style scoped>
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
</style>