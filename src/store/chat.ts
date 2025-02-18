// 导入Vue的响应式API
import { ref } from 'vue'

// 定义消息接口，描述聊天消息的数据结构
interface Message {
  role: 'user' | 'assistant'  // 消息发送者角色：用户或AI助手
  content: string             // 消息内容
}

// 聊天状态管理函数，提供消息列表的状态和操作方法
export function useChatStore() {
  // 消息列表状态，使用ref使其具有响应性
  const messages = ref<Message[]>([])
  // 加载状态标志，用于控制UI交互
  const isLoading = ref(false)

  // 添加新消息到消息列表
  const addMessage = (message: Message) => {
    messages.value.push(message)
  }

  // 清空消息列表
  const clearMessages = () => {
    messages.value = []
  }

  // 返回状态和方法供组件使用
  return {
    messages,
    isLoading,
    addMessage,
    clearMessages
  }
}