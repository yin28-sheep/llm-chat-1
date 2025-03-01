<template>
  <button class="copy-button" :class="{ 'copied': isCopied }" @click="copyContent">
    <span class="copy-icon">📋</span>
    {{ buttonText }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义组件属性
const props = defineProps<{
  content: string
}>()

// 组件状态
const isCopied = ref(false)
const buttonText = ref('复制')

// 复制功能实现
const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(props.content)
    isCopied.value = true
    buttonText.value = '已复制'
    
    // 3秒后重置状态
    setTimeout(() => {
      isCopied.value = false
      buttonText.value = '复制'
    }, 3000)
  } catch (error) {
    console.error('复制失败:', error)
  }
}
</script>

<style scoped>
@import '@/styles/Copybutton.css';
</style>