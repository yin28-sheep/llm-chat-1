<template>
  <div class="message-bubble user-message">
    <div class="role">You</div>
    <div class="message-content">
      <!-- 使用Markdown渲染用户消息 -->
      <vue-markdown-it
        :source="message.content"
        class="markdown-content"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import VueMarkdownIt from 'vue3-markdown-it' // 导入Markdown渲染组件

// 定义组件属性
interface Props {
  message: {
    role: string
    content: string
  }
}

defineProps<Props>()
</script>

<style scoped>
@import '@/styles/ChatMessageUser.css';
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