// 聊天消息显示组件：负责渲染和管理聊天消息列表
<template>
  <!-- 聊天记录显示区域，使用ref获取DOM元素用于滚动控制 -->
  <div class="chat-log" ref="chatLogRef">
    <!-- 遍历显示聊天消息，根据角色应用不同样式 -->
    <div
      v-for="(message, index) in chatMessages"
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
    <!-- 加载状态提示 -->
    <div v-if="isLoading" class="loading">AI正在思考中...</div> 
  </div> 
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessageStore } from '../store/MessageStore'
import CopyButton from './CopyButton.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 组件状态管理
const chatLogRef = ref<HTMLElement | null>(null) // 聊天记录容器引用
const messageStore = useMessageStore() // 初始化消息状态管理store
const { messages: chatMessages, isLoading } = storeToRefs(messageStore) // 获取聊天消息列表和加载状态

// 监听消息列表变化
watch(chatMessages, () => {
  scrollToBottom()
})

// 组件挂载时滚动到底部
onMounted(() => {
  scrollToBottom()
})

// 代码高亮处理函数
const highlightCode = (code: string, language: string) => {
  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(code, { language }).value
    } catch (e) {
      console.error('代码高亮处理错误:', e)
    }
  }
  // 如果没有指定语言或发生错误，尝试自动检测语言
  return hljs.highlightAuto(code).value
}

// 处理消息内容，识别并格式化代码块
const processMessageContent = (content: string) => {
  const codeBlockRegex = /```([a-zA-Z]*)\n?([\s\S]*?)```/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // 添加代码块前的普通文本
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      })
    }

    // 添加代码块，包含语言信息
    parts.push({
      type: 'code',
      language: match[1] || '',
      content: match[2].trim()
    })

    lastIndex = match.index + match[0].length
  }

  // 添加最后的普通文本
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    })
  }

  return parts
}

// 滚动到聊天记录底部的方法
// 使用nextTick确保DOM更新后再执行滚动
const scrollToBottom = () => {
  nextTick(() => {
    if (chatLogRef.value) {
      // 检查是否存在滚动条
      const hasScrollbar = chatLogRef.value.scrollHeight > chatLogRef.value.clientHeight
      if (hasScrollbar) {
        // 存在滚动条时，滚动到底部
        chatLogRef.value.scrollTop = chatLogRef.value.scrollHeight
      }
    }
  })
}

// 暴露方法给父组件
defineExpose({
  scrollToBottom
})
</script>

<style scoped>
@import '@/styles/ChatMessage.css';
</style>