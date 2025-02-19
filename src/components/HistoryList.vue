// 历史会话列表组件：负责展示和管理所有聊天会话记录
<template>
  <!-- 历史会话列表容器，使用flex布局实现垂直滚动 -->
  <div class="history-list">
    <!-- 遍历渲染每个会话项，使用v-for动态生成会话列表 -->
    <history-list-chat
      v-for="session in chatSessions"
      :key="session.id"
      :session="session"
      :is-active="currentSessionId === session.id"
    />
  </div>
</template>

<script setup lang="ts">
// 导入状态管理相关依赖
import { storeToRefs } from 'pinia'
import { useCreateMessageStore } from '../store/CreateMessageStore'
import HistoryListChat from './HistoryListChat.vue'

// 初始化消息状态管理store
const store = useCreateMessageStore()
// 解构获取会话列表和当前会话ID，使用storeToRefs保持响应性
const { chatSessions, currentSessionId } = storeToRefs(store)

</script>

<style scoped>

@import '@/styles/HistoryList.css';

</style>