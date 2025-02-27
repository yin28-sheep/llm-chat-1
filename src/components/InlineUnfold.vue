<template>
  <div class="inline-unfold">
    <div class="dialog-box">
      <div class="dialog-header">
        <h3>对话框</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="dialog-content">
        <div class="input-section">
          <inline-dialog @send="handleSend" />
        </div>
        <div class="message-section">
          <inline-message v-if="currentMessage" :message="currentMessage" :role="currentMessage.role" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InlineDialog from './InlineDialog.vue'
import InlineMessage from './InlineMessage.vue'

// 定义事件
const emit = defineEmits(['close', 'send'])

// 当前消息状态
const currentMessage = ref<{ role: string; content: string } | null>(null)

// 处理发送消息
const handleSend = (message: string) => {
  currentMessage.value = {
    role: 'user',
    content: message
  }
  emit('send', message)
}

// 处理关闭对话框
const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
@import'@/styles/InlineUnfold.css'
</style>