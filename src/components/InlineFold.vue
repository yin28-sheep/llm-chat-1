<template>
  <div class="inline-fold" @click="handleClick">
    <div class="search-box">
      <input
        type="text"
        placeholder="请输入内容..."
        readonly
        class="search-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

// 定义事件
const emit = defineEmits(['expand'])

// 处理点击事件，触发展开状态
const handleClick = () => {
  emit('expand')
}
</script>

<style scoped>
@import '@/styles/inlinefold.css';
</style>