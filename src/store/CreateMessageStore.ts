// 聊天会话状态管理模块
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { switchToChat } from '../utils/ListChatToMitter'
import { useMainStore } from './TopStore'
import { useSessionStore } from './SessionStore'

// 创建并导出会话管理store
export const useCreateMessageStore = defineStore('createMessage', () => {
  // 状态定义
  const isCreatingNewSession = ref(false)  // 是否正在创建新会话
  const mainStore = useMainStore()  // 引入TopStore
  const sessionStore = useSessionStore()  // 引入SessionStore

  // 创建新会话
  function createNewSession(name: string) {
    const sessionId = Date.now().toString()  // 使用时间戳作为会话ID
    mainStore.addSessionId(sessionId)  // 添加新会话ID到TopStore
    mainStore.setCurrentSessionId(sessionId)  // 设置当前会话ID
    if (!mainStore.sessionMessages[sessionId]) {
      mainStore.sessionMessages[sessionId] = []
    }
    sessionStore.setSessionName(sessionId, name)  // 使用SessionStore存储会话名称
    isCreatingNewSession.value = false
    // 自动触发切换会话事件
    switchToChat({
      sessionId,
      title: name
    })
  }

  // 设置创建会话状态
  const setCreatingNewSession = (status: boolean) => {
    isCreatingNewSession.value = status
  }

  // 导出状态和方法
  return {
    isCreatingNewSession,
    createNewSession,
    setCreatingNewSession,
  }
})