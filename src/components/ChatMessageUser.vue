<template>
  <div class="message-bubble user-message">
    <div class="role">You</div>
    <div class="message-content text-content">
      {{ message.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// 定义组件属性
interface Props {
  message: {
    role: string
    content: string
  }
}

defineProps<Props>()
</script>

<style scoped>
@import '@/styles/ChatMessageUser.css';
</style>