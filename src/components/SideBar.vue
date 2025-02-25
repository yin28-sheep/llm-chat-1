<template>
  <div class="sidebar">
    <Tools :current-mode="currentMode" @toggle-mode="handleModeToggle" />
    <CreateMessage />
    <HistoryList />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Tools from './Tools.vue'
import CreateMessage from './CreateMessage.vue'
import HistoryList from './HistoryList.vue'
import { useChatStore } from '../store/chatStore'

// 使用状态管理来控制模式
const store = useChatStore()
const { currentMode } = storeToRefs(store)

// 处理模式切换
const handleModeToggle = (mode: 'search' | 'dialog' | 'chat') => {
  store.setMode(mode)
}
</script>

<style scoped>
@import '@/styles/SideBar.css';
</style>