// 历史会话列表组件：负责展示和管理所有聊天会话记录
<template>
  <!-- 历史会话列表容器，使用flex布局实现垂直滚动 -->
  <div class="history-list">
    <!-- 遍历渲染每个会话项，使用v-for动态生成会话列表 -->
    <history-list-chat
      v-for="sessionId in mainStore.sessionIds"
      :key="sessionId"
      :session="{
        sessionId: sessionId,
        name: sessionStore.getSessionName(sessionId)
      }"
      :is-active="mainStore.currentSessionId === sessionId"
    />
  </div>
</template>

<script setup lang="ts">
// 导入状态管理相关依赖
import { useSessionStore } from '../store/SessionStore'
import { useMainStore } from '../store/TopStore'
import HistoryListChat from './HistoryListChat.vue'

// 初始化状态管理store
const sessionStore = useSessionStore()
const mainStore = useMainStore()

</script>

<style scoped>

@import '@/styles/HistoryList.css';

</style>