<template>
  <div class="history-list">
    <div v-for="session in chatSessions" 
         :key="session.id"
         class="history-item"
         :class="{ 'active': currentSessionId === session.id }"
         @click="selectSession(session.id)">
      <span class="message-preview">{{ session.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCreateMessageStore } from '../store/CreateMessageStore'

const store = useCreateMessageStore()
const { chatSessions, currentSessionId } = storeToRefs(store)
const { selectSession } = store
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