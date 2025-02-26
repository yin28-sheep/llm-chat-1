import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Message } from '../types/chatMessages';
import { useMainStore } from './TopStore';

// 定义并导出消息管理 store
export const useMessageStore = defineStore('message', () => {
  // 加载状态
  const isLoading = ref<boolean>(false);
  // 最新的流式响应内容
  const streamContent = ref<string>('');

  // 获取 TopStore 实例
  const mainStore = useMainStore();

  // 添加新消息
  const addMessage = (message: Message) => {
    if (!mainStore.currentSessionId) {
      console.warn('No current session ID found');
      return;
    }

    const sessionId = mainStore.currentSessionId;

    if (!mainStore.sessionMessages[sessionId]) {
      mainStore.sessionMessages[sessionId] = [];
    }

    mainStore.sessionMessages[sessionId].push({ ...message, sessionId });
  };

  // 清空当前会话消息
  const clearMessages = () => {
    if (!mainStore.currentSessionId) {
      console.warn('No current session ID found');
      return;
    }

    mainStore.sessionMessages[mainStore.currentSessionId] = [];
  };

  // 设置加载状态
  const setLoading = (status: boolean) => {
    isLoading.value = status;
  };

  // 处理流式响应数据
  const handleStreamingResponse = (content: string) => {
    streamContent.value = content;

    // 更新最后一条 AI 消息的内容
    if (!mainStore.currentSessionId) {
      console.warn('No current session ID found');
      return;
    }

    const sessionId = mainStore.currentSessionId;
    const sessionMessages = mainStore.sessionMessages[sessionId] || [];

    if (sessionMessages.length > 0) {
      const lastMessage = sessionMessages[sessionMessages.length - 1];
      if (lastMessage.role === 'assistant') {
        lastMessage.content = content;
      }
    }
  };

  return {
    isLoading,
    streamContent,
    addMessage,
    clearMessages,
    setLoading,
    handleStreamingResponse,
  };
});