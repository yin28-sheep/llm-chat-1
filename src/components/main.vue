<template>
  <div class="main-container">
    <!-- 根据当前形态显示不同组件 -->
    <template v-if="store.isSearchMode">
      <inline-fold @expand="handleExpand" />
    </template>
    <template v-else-if="store.isDialogMode">
      <inline-unfold @close="handleClose" />
    </template>
    <template v-else-if="store.isChatMode">
      <Chat />
    </template>
  </div>
</template>

<script setup lang="ts">
import InlineFold from './InlineFold.vue'
import InlineUnfold from './InlineUnfold.vue'
import Chat from './chat.vue'
import { useMainStore } from '../store/TopStore'

// 使用TopStore来控制模式
const store = useMainStore()

// 处理展开事件
const handleExpand = () => {
  store.setActiveMode('dialog')
}

// 处理关闭事件
const handleClose = () => {
  store.setActiveMode('search')
}
</script>

<style scoped>
@import'@/styles/main.css'
</style>