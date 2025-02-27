<template>
  <div class="chat-container">
    <div class="chat-header" v-if="showTitle">
      <h2 class="session-title">{{ currentSessionName }}</h2>
    </div>
    <div class="chat-log" ref="chatLogRef">
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

// 组件状态管理
const chatLogRef = ref<HTMLElement | null>(null); // 聊天记录容器引用
const messageStore = useMessageStore(); // 初始化消息状态管理store
const mainStore = useMainStore(); // 初始化主store
const sessionStore = useSessionStore(); // 初始化会话状态管理store

// 获取加载状态
const isLoading = ref(messageStore.isLoading);

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

// 监听消息列表变化
watch(() => messages.value, () => {
  scrollToBottom();
});

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
</style>