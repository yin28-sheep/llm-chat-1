<template>
  <div class="input-area">
    <input
      v-model="inputText"
      class="message-input"
      placeholder="请输入内容..."
      @keyup.enter="handleSend"
    />
    <chat-bottom-send @send="handleSend" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ChatBottomSend from './ChatBottomSend.vue'
import { useChatBottomStore } from '../store/ChatBottomStore'

// 初始化store
const chatBottomStore = useChatBottomStore()

// 定义事件
const emit = defineEmits(['send'])

// 输入状态
const inputText = ref('')
const hasInput = ref(false)

// 监听输入内容变化
watch(inputText, (newValue) => {
  hasInput.value = newValue.trim().length > 0
  chatBottomStore.setInputText(newValue)
})

// 处理发送消息
const handleSend = () => {
  const message = inputText.value.trim()
  if (!message) return
  
  emit('send', message)
  inputText.value = ''
  chatBottomStore.setInputText('')
}
</script>

<style scoped>
@import'@/styles/InlineDialog.css'
</style>