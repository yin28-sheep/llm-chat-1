<template>
  <div class="create-message">
    <button class="create-button" @click="createNewChat">
      <span class="plus-icon">+</span>
      <span>新建会话</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '../store/chat'

const { clearMessages } = useChatStore()

const createNewChat = () => {
  clearMessages()
}
</script>

<style scoped>
.create-message {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.create-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #0056b3;
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
}
</style>