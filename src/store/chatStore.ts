import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义消息接口
interface Message {
  role: 'user' | 'assistant'
  content: string
}

// 定义并导出聊天状态管理store
export const useChatStore = defineStore('chat', () => {
  // 消息列表状态
  const messages = ref<Message[]>([])
  // 加载状态标志
  const isLoading = ref(false)

  // 添加新消息
  const addMessage = (message: Message) => {
    messages.value.push(message)
  }

  // 清空消息列表
  const clearMessages = () => {
    messages.value = []
  }

  // 设置加载状态
  const setLoading = (status: boolean) => {
    isLoading.value = status
  }

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
    setLoading
  }
})