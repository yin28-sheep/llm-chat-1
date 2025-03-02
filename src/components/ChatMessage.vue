<template>
  <div class="chat-container">
    <div v-if="showTitle" class="chat-header">
      <h2 class="session-title">{{ currentSessionName }}</h2>
    </div>
    <div ref="chatLogRef" class="chat-log">
      <template v-for="(message, index) in messages" :key="index">
        <chat-message-user
          v-if="message.role === 'user'"
          :message="message"
        />
        <chat-message-chat
          v-else
          :message="message"
        />
      </template>
      <div v-if="isLoading" class="loading">AI正在思考中...</div> 
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed } from 'vue';
import { useMessageStore } from '../store/MessageStore';
import { useMainStore } from '../store/TopStore';
import { useSessionStore } from '../store/SessionStore';
import ChatMessageUser from './ChatMessageUser.vue';
import ChatMessageChat from './ChatMessageChat.vue';
// 导入Markdown相关组件
import 'highlight.js/styles/github.css';

// 组件状态管理
const chatLogRef = ref<HTMLElement | null>(null); // 聊天记录容器引用
const messageStore = useMessageStore(); // 初始化消息状态管理store
const mainStore = useMainStore(); // 初始化主store
const sessionStore = useSessionStore(); // 初始化会话状态管理store

// 获取加载状态
const isLoading = computed(() => messageStore.isLoading);

// 获取当前会话名称
const currentSessionName = computed(() => {
  const currentSessionId = mainStore.currentSessionId;
  return currentSessionId ? sessionStore.getSessionName(currentSessionId) : '';
});

// 判断是否显示标题
const showTitle = computed(() => {
  return !!mainStore.currentSessionId;
});

// 计算当前会话的消息
const messages = computed(() => {
  const currentSessionId = mainStore.currentSessionId;
  if (!currentSessionId || !mainStore.sessionMessages[currentSessionId]) {
    return [];
  }
  return mainStore.sessionMessages[currentSessionId];
});
// 监听消息列表变化和加载状态变化
// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch([() => messages.value, isLoading, () => messageStore.streamContent], ([_messagesVal, loading, streamContent]) => {
  if (!loading || streamContent) {
    scrollToBottom();
  }
}, { deep: true });

// 组件挂载时滚动到底部
onMounted(() => {
  scrollToBottom();
});

// 滚动到底部方法
const scrollToBottom = () => {
  nextTick(() => {
    if (chatLogRef.value) {
      chatLogRef.value.scrollTop = chatLogRef.value.scrollHeight;
    }
  });
};

// 暴露滚动方法给父组件
defineExpose({
  scrollToBottom
});
</script>

<style scoped>
@import '@/styles/ChatMessage.css';
/* Markdown内容样式 */
.markdown-content {
  line-height: 1.6;

  /* 匹配原有文本样式 */
  font-size: 14px;
  color: var(--text-primary);

  /* 处理Markdown元素 */
  :deep(h1) { font-size: 1.5em; margin: 0.8em 0; }
  :deep(h2) { font-size: 1.3em; margin: 0.6em 0; }
  :deep(ul) { padding-left: 1.2em; }
  :deep(li) { margin: 0.4em 0; }
  :deep(a) { color: var(--link-color); }
}
</style>