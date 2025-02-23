<template>
  <div class="input-container">
    <textarea
      v-model="inputText"
      class="input"
      :class="{ 'overflow-scroll': hasOverflow }"
      placeholder="请输入内容..."
      @keyup.enter="handleEnter"
      @input="adjustHeight"
      :disabled="isLoading"
      ref="textareaRef"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChatBottomStore } from '../store/ChatBottomStore'
import { useChatStore } from '../store/chatStore'
import { ref, onMounted, nextTick } from 'vue'

// 初始化store
const chatBottomStore = useChatBottomStore()
const chatStore = useChatStore()

// 获取状态
const { inputText } = storeToRefs(chatBottomStore)
const { isLoading } = storeToRefs(chatStore)

// 定义事件
const emit = defineEmits(['send'])

// 文本域引用和状态
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const hasOverflow = ref(false)

// 调整高度的函数
const adjustHeight = () => {
  const textarea = textareaRef.value
  if (!textarea) return

  // 临时重置高度以获取准确的scrollHeight
  textarea.style.height = '24px'
  
  // 立即计算内容的实际高度
  const contentHeight = textarea.scrollHeight
  const maxHeight = Math.floor(1.5 * 16 * 3 + 24) // 三行文字高度加上padding

  // 立即设置新的高度
  textarea.style.height = contentHeight <= maxHeight ? `${contentHeight}px` : `${maxHeight}px`
  hasOverflow.value = contentHeight > maxHeight
}

// 处理回车事件
const handleEnter = () => {
  const message = inputText.value.trim()
  if (!message || isLoading.value) return
  
  emit('send')
  chatBottomStore.clearInputText()
  // 重置输入框高度
  if (textareaRef.value) {
    textareaRef.value.style.height = '24px'
  }
  hasOverflow.value = false
}

// 组件挂载时初始化
onMounted(() => {
  adjustHeight()
})
</script>

<style scoped>
@import '@/styles/ChatBottomIn.css'
</style>