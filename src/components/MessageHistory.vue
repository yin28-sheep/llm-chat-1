<template>
  <!-- 消息历史记录组件容器 -->
  <div class="message-history">
    <!-- 组件标题 -->
    <h2>消息记录</h2>
    <!-- 历史消息列表容器 -->
    <div class="history-list">
      <!-- 遍历显示历史消息，支持点击选择和高亮显示当前选中项 -->
      <div v-for="(message, index) in chatMessages" 
           :key="index"
           class="history-item"
           :class="{ 'active': currentMessageIndex === index }"
           @click="selectMessage(index)">
        <!-- 消息预览内容，超长时显示省略号 -->
        <span class="message-preview">{{ getMessagePreview(message.content) }}</span>
        <!-- 消息发送者标识 -->
        <span class="message-time">{{ message.role === 'user' ? '我' : 'AI' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入所需的Vue组件和状态管理工具
import { ref } from 'vue'
import { useChatStore } from '../store/chat'

// 从聊天状态管理中获取消息列表
const { messages: chatMessages } = useChatStore()
// 当前选中消息的索引
const currentMessageIndex = ref(-1)

// 选择消息的处理函数
const selectMessage = (index: number) => {
  currentMessageIndex.value = index
}

// 获取消息预览内容，超过30字符时截断并添加省略号
const getMessagePreview = (content: string) => {
  return content.length > 30 ? content.substring(0, 30) + '...' : content
}
</script>

<style scoped>
/* 消息历史记录容器样式 */
.message-history {
  width: 300px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

/* 标题样式 */
.message-history h2 {
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid #e0e0e0;
}

/* 历史消息列表容器样式 */
.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

/* 历史消息项样式 */
.history-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 鼠标悬停效果 */
.history-item:hover {
  background-color: #f8f8f8;
}

/* 选中状态样式 */
.history-item.active {
  background-color: #e8f4ff;
}

/* 消息预览文本样式 */
.message-preview {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 消息时间/发送者标识样式 */
.message-time {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}
</style>