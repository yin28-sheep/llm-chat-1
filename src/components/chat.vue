// 主聊天界面组件：整合聊天消息显示和输入功能
<template>
  <!-- 聊天界面主容器 -->
  <div class="container">
    <!-- 标题：显示当前AI模型名称 -->
    <h1>{{ currentTitle || 'DeepSeek-V3' }}</h1>
    
    <!-- 聊天消息组件：用于显示消息历史记录 -->
    <chat-message ref="messageRef" />
    <!-- 底部输入组件：用于用户输入和发送消息 -->
    <chat-bottom @scroll="handleScroll" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ChatBottom from './ChatBottom.vue'
import { onSwitchChat, onDeleteChat, onRenameChat, removeListener } from '../utils/ListChatToMitter'
import { useChatStore } from '../store/chatStore'

// 初始化聊天状态管理
const chatStore = useChatStore()


// 组件引用：用于控制消息列表滚动
const messageRef = ref<{ scrollToBottom: () => void } | null>(null)
const currentTitle = ref<string>('')

// 处理滚动事件：当新消息发送或接收时，滚动到底部
const handleScroll = () => {
  messageRef.value?.scrollToBottom()
}


// 处理会话切换事件
const handleSwitchChat = (chatInfo: { id: string; title: string }) => {
  currentTitle.value = chatInfo.title
  // 切换到新会话并加载对应的消息记录
  chatStore.switchSession(chatInfo.id)
}

// 处理会话删除事件
const handleDeleteChat = (sessionId: string) => {
  if (sessionId === chatStore.currentSessionId) {
    currentTitle.value = ''
    chatStore.clearMessages()
  }
}

// 处理会话重命名事件
const handleRenameChat = (info: { id: string; newTitle: string }) => {
  if (info.id === chatStore.currentSessionId) {
    currentTitle.value = info.newTitle
  }
}

// 组件挂载时添加事件监听
onMounted(() => {
  onSwitchChat(handleSwitchChat)
  onDeleteChat(handleDeleteChat)
  onRenameChat(handleRenameChat)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  removeListener('switchChat')
  removeListener('deleteChat')
  removeListener('renameChat')
})
</script>


<style scoped>
/* 使用 @import 引入外部样式文件 */
@import '@/styles/chat.css';

</style>