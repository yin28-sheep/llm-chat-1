<template>
  <div class="message-bubble ai-message">
    <div class="role">AI</div>
    <div class="message-content">
      <template v-for="(part, partIndex) in processMessageContent(message.content)" :key="partIndex">
        <div v-if="part.type === 'text'" class="text-content">{{ part.content }}</div>
        <div v-else-if="part.type === 'code'" class="code-block">
          <div class="code-header">
            <span v-if="part.language" class="code-language">{{ part.language }}</span>
            <copy-button :content="part.content" />
          </div>
          <!-- 安全说明: 这里使用v-html是安全的，因为内容经过highlightCode函数处理，且源自可信的AI响应 -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <pre class="code-content" v-html="highlightCode(part.content, part.language)"></pre>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import CopyButton from './CopyButton.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 定义组件属性
interface Props {
  message: {
    role: string
    content: string
  }
}

defineProps<Props>()

// 代码高亮处理函数
const highlightCode = (code: string, language: string) => {
  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(code, { language }).value
    } catch (e) {
      console.error('代码高亮处理错误:', e)
    }
  }
  return hljs.highlightAuto(code).value
}

// 处理消息内容，识别并格式化代码块
const processMessageContent = (content: string) => {
  const parts = []
  let lastIndex = 0
  const codeBlockRegex = /```([a-zA-Z]*)\n?([\s\S]*?)```/g
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // 添加代码块前的文本
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      })
    }

    // 添加代码块
    parts.push({
      type: 'code',
      language: match[1] || '',
      content: match[2].trim()
    })

    lastIndex = match.index + match[0].length
  }

  // 添加剩余的文本
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    })
  }

  return parts
}
</script>

<style scoped>
@import '@/styles/ChatMessageChat.css';
</style>