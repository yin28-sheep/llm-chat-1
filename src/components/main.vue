<template>
  <div class="main-container">
    <!-- 根据当前形态显示不同组件 -->
    <template v-if="currentMode === 'search'">
      <inline-fold @expand="handleExpand" />
    </template>
    <template v-else-if="currentMode === 'dialog'">
      <inline-unfold @close="handleClose" />
    </template>
    <template v-else>
      <chat />
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import InlineFold from './InlineFold.vue'
import InlineUnfold from './InlineUnfold.vue'
import Chat from './chat.vue'
import { useCoreStore } from '../store/CoreStore'

// 使用状态管理来控制模式
const store = useCoreStore()
const { currentMode } = storeToRefs(store)

// 处理展开事件
const handleExpand = () => {
  store.setMode('dialog')
}

// 处理关闭事件
const handleClose = () => {
  store.setMode('search')
}
</script>

<style scoped>
@import'@/styles/main.css'
</style>