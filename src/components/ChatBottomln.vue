<template>
  <div class="input-container">
    <input
      v-model="inputText"
      class="input"
      placeholder="请输入消息"
      @keyup.enter="handleEnter"
      :disabled="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChatBottomStore } from '../store/ChatBottomStore'
import { useChatStore } from '../store/chatStore'

// 初始化store
const chatBottomStore = useChatBottomStore()
const chatStore = useChatStore()

// 获取状态
const { inputText } = storeToRefs(chatBottomStore)
const { isLoading } = storeToRefs(chatStore)

// 定义事件
const emit = defineEmits(['send'])

// 处理回车事件
const handleEnter = () => {
  const message = inputText.value.trim()
  if (!message || isLoading.value) return
  
  emit('send')
  chatBottomStore.clearInputText()
}
</script>

<style scoped>
.input-container {
  display: flex;
  padding: 10px;
}

.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>