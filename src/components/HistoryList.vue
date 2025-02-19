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
/* 历史会话列表容器样式 */
.history-list {
  flex: 1;                /* 占用剩余空间 */
  overflow-y: auto;       /* 垂直方向可滚动 */
  padding: 10px;          /* 内边距 */
}

/* 历史会话项基础样式 */
.history-item {
  padding: 15px;          /* 内边距 */
  border-bottom: 1px solid #f0f0f0;  /* 底部边框 */
  cursor: pointer;        /* 鼠标指针样式 */
  transition: background-color 0.2s;  /* 背景色过渡动画 */
  display: flex;          /* 弹性布局 */
  justify-content: space-between;     /* 两端对齐 */
  align-items: center;    /* 垂直居中 */
}

/* 历史会话项悬停效果 */
.history-item:hover {
  background-color: #f8f8f8;  /* 浅灰色背景 */
}

/* 当前选中的历史会话项样式 */
.history-item.active {
  background-color: #e8f4ff;  /* 浅蓝色背景 */
}

/* 会话预览文本样式 */
.message-preview {
  flex: 1;                /* 占用剩余空间 */
  overflow: hidden;       /* 溢出隐藏 */
  text-overflow: ellipsis;/* 文本溢出显示省略号 */
  white-space: nowrap;    /* 不换行 */
}
</style>