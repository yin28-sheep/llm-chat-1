<template>
  <div class="input-container">
    <textarea
      ref="textareaRef"
      v-model="inputStore.inputText"
      class="input"
      :class="{ 'overflow-scroll': hasOverflow }"
      placeholder="请输入内容..."
      :disabled="messageStore.isLoading"
      @keyup.enter="handleEnter"
      @input="adjustHeight"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { useInputStore } from '../store/InputStore'
import { useMessageStore } from '../store/MessageStore'
import { ref, onMounted, nextTick, watch } from 'vue'

// 初始化store
const inputStore = useInputStore()
const messageStore = useMessageStore()

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
  
  // 使用nextTick确保DOM更新后再计算高度
  nextTick(() => {
    // 计算内容的实际高度
    const contentHeight = textarea.scrollHeight
    const maxHeight = Math.floor(1.5 * 16 * 3 + 24) // 三行文字高度加上padding

    // 设置新的高度
    textarea.style.height = contentHeight <= maxHeight ? `${contentHeight}px` : `${maxHeight}px`
    hasOverflow.value = contentHeight > maxHeight
  })
}

// 监听输入文本变化，确保在文本清空时也能调整高度
watch(() => inputStore.inputText, (newText) => {
  // 当文本被清空或大幅删减时，确保高度重新计算
  if (newText === '' || newText.length < 10) {
    adjustHeight()
  }
}, { immediate: true })

// 处理回车事件
const handleEnter = (event) => {
  // 如果按下了Shift键+Enter，则插入换行符而不是发送消息
  if (event.shiftKey) {
    // 不阻止默认行为，允许换行
    return
  }
  
  // 阻止默认行为，防止输入回车
  event.preventDefault()
  
  const message = inputStore.inputText.trim()
  if (!message || messageStore.isLoading) return
  
  emit('send')
  inputStore.clearInputText()
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