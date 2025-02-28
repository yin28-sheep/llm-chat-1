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
        <div class="message-section" ref="messageContainer">
          <inline-message :messages="currentSessionMessages" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import InlineDialog from './InlineDialog.vue'
import InlineMessage from './InlineMessage.vue'
import { useMainStore } from '../store/TopStore'
import { useSendStore } from '../store/SendStore'
import { useInputStore } from '../store/InputStore'
import { useMessageStore } from '../store/MessageStore'

// 初始化store
const store = useMainStore()
const inputStore = useInputStore()
const messageStore = useMessageStore()

// 定义事件
const emit = defineEmits(['close', 'send'])

// 获取当前会话消息
const currentSessionMessages = computed(() => {
  const sessionId = store.currentSessionId
  return sessionId ? store.sessionMessages[sessionId] || [] : []
})

const messageContainer = ref<HTMLElement | null>(null)

// 监听消息列表变化，自动滚动到底部
watch(() => currentSessionMessages.value, () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}, { deep: true })

// 监听流式响应，实时更新UI
watch(() => messageStore.streamContent, () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
})

// 处理发送消息
const handleSend = async (message: string) => {
  if (!message.trim() || messageStore.isLoading) return
  
  // 设置输入内容到InputStore，这样SendStore可以正确获取
  inputStore.setInputText(message)
  
  // 调用SendStore的sendMessage方法获取AI回复
  const sendStore = useSendStore()
  await sendStore.sendMessage()
  
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