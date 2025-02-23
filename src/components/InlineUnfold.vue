<template>
  <div class="inline-unfold">
    <div class="dialog-box">
      <div class="dialog-header">
        <h3>对话框</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="dialog-content">
        <div class="input-area">
          <input
            v-model="inputText"
            class="message-input"
            placeholder="请输入内容..."
            @keyup.enter="handleSend"
          />
          <button class="send-btn" @click="handleSend">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '../store/chatStore'
import { useChatBottomStore } from '../store/ChatBottomStore'

// 定义事件
const emit = defineEmits(['close', 'send'])

// 输入消息状态
const chatStore = useChatStore()
const inputText = ref('')

// 处理发送消息
const handleSend = async () => {
  const message = inputText.value.trim()
  if (!message) return

  // 使用ChatBottomStore处理消息发送
  const chatBottomStore = useChatBottomStore()
  chatBottomStore.setInputText(message)
  
  // 先切换到chat模式并清空输入
  chatStore.setMode('chat')
  inputText.value = ''
  
  try {
    // 异步处理消息发送
    await chatBottomStore.sendMessage(
      chatStore.messages,
      chatStore.addMessage,
      chatStore.setLoading,
      () => {}
    )
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

// 处理关闭对话框
const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
@import'@/styles/InlineUnfold.css'
</style>