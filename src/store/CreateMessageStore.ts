// 聊天会话状态管理模块
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { switchToChat } from '../utils/ListChatToMitter'
import type { ChatSession } from '../types/chatMessages'

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
    // 自动触发切换会话事件
    switchToChat({
      id: newSession.id,
      title: newSession.name
    })
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