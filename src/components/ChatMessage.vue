<template>
  <div class="chat-container">
    <div class="chat-header" v-if="showTitle">
      <h2 class="session-title">{{ currentSessionName }}</h2>
    </div>
    <div class="chat-log" ref="chatLogRef">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message-bubble', message.role === 'user' ? 'user-message' : 'ai-message']"
      >
        <div class="role">{{ message.role === 'user' ? 'You' : 'AI' }}</div>
        <div class="message-content">
          <template v-for="(part, partIndex) in processMessageContent(message.content)" :key="partIndex">
            <div v-if="part.type === 'text'" class="text-content">{{ part.content }}</div>
            <div v-else-if="part.type === 'code'" class="code-block">
              <div class="code-header">
                <span v-if="part.language" class="code-language">{{ part.language }}</span>
                <copy-button :content="part.content" />
              </div>
              <pre class="code-content" v-html="highlightCode(part.content, part.language)"></pre>
            </div>
          </template>
        </div>
      </div>
      <div v-if="isLoading" class="loading">AI正在思考中...</div> 
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed } from 'vue';
import { useMessageStore } from '../store/MessageStore';
import { useMainStore } from '../store/TopStore';
import { useSessionStore } from '../store/SessionStore';
import CopyButton from './CopyButton.vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

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

// 代码高亮处理函数
const highlightCode = (code: string, language: string) => {
  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(code, { language }).value;
    } catch (e) {
      console.error('代码高亮处理错误:', e);
    }
  }
  // 如果没有指定语言或发生错误，尝试自动检测语言
  return hljs.highlightAuto(code).value;
};

// 处理消息内容，识别并格式化代码块
const processMessageContent = (content: string) => {
  const codeBlockRegex = /```([a-zA-Z]*)\n?([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // 添加代码块前的普通文本
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }

    // 添加代码块
    parts.push({
      type: 'code',
      language: match[1] || ' ',
      content: match[2].trim()
    });

    lastIndex = match.index + match[0].length;
  }

  // 添加最后一段普通文本
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  return parts;
};

// 暴露滚动方法给父组件
defineExpose({
  scrollToBottom
});
</script>

<style scoped>
@import '@/styles/ChatMessage.css';
</style>