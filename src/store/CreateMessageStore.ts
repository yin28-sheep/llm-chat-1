// 聊天会话状态管理模块
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义聊天会话接口
interface ChatSession {
  id: string      // 会话唯一标识
  name: string    // 会话名称
  messages: Array<{  // 会话消息列表
    role: 'user' | 'assistant'  // 消息角色：用户或AI助手
    content: string             // 消息内容
  }>
}

// 创建并导出会话管理store
export const useCreateMessageStore = defineStore('createMessage', () => {
  // 状态定义
  const chatSessions = ref<ChatSession[]>([])  // 所有聊天会话列表
  const currentSessionId = ref<string | null>(null)  // 当前选中的会话ID
  const isCreatingNewSession = ref(false)  // 是否正在创建新会话

  // 创建新会话
  const createNewSession = (name: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),  // 使用时间戳作为会话ID
      name,
      messages: []
    }
    chatSessions.value.push(newSession)
    currentSessionId.value = newSession.id
    isCreatingNewSession.value = false
  }

  // 设置创建会话状态
  const setCreatingNewSession = (status: boolean) => {
    isCreatingNewSession.value = status
  }

  // 选择会话
  const selectSession = (sessionId: string) => {
    currentSessionId.value = sessionId
  }

  // 获取当前选中的会话
  const getCurrentSession = () => {
    return chatSessions.value.find(session => session.id === currentSessionId.value)
  }

  // 导出状态和方法
  return {
    chatSessions,
    currentSessionId,
    isCreatingNewSession,
    createNewSession,
    setCreatingNewSession,
    selectSession,
    getCurrentSession,
  }
})