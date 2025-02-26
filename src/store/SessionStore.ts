// SessionStore.ts
// 负责会话管理和消息映射，是整个应用的会话状态管理核心
// 主要功能包括：
// 1. 维护所有会话的消息映射，确保每个会话的消息都能正确存储和检索
// 2. 管理当前会话ID，与TopStore协同工作实现会话状态的同步
// 3. 提供会话切换和消息获取方法，支持会话间的无缝切换
// 4. 处理消息的添加和清空操作，确保消息状态的正确维护

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useMainStore } from './TopStore'
import type { Message} from '../types/chatMessages'
import { useCreateMessageStore } from './CreateMessageStore'

// 定义并导出会话管理store
export const useSessionStore = defineStore('session', () => {
  // 从TopStore获取实例
  const mainStore = useMainStore()

  // 切换会话
  // @param sessionId - 目标会话的唯一标识符
  const switchSession = (sessionId: string) => {
    mainStore.setCurrentSessionId(sessionId)
  }

  // 获取当前会话的消息列表
  // 返回一个计算属性，自动根据currentSessionId的变化更新消息列表
  const getCurrentSessionMessages = computed(() => {
    if (!mainStore.currentSessionId) {
      return []
    }
    return mainStore.sessionMessages[mainStore.currentSessionId] || []
  })

  // 添加消息到指定会话
  // @param sessionId - 目标会话的唯一标识符
  // @param message - 要添加的消息对象
  const addMessageToSession = (sessionId: string, message: Message) => {
    if (!mainStore.sessionMessages[sessionId]) {
      mainStore.sessionMessages[sessionId] = []
    }
    mainStore.sessionMessages[sessionId].push({ ...message, sessionId })
  }

  // 清空指定会话的消息
  // @param sessionId - 要清空消息的会话ID
  const clearSessionMessages = (sessionId: string) => {
    mainStore.sessionMessages[sessionId] = []
  }

  // 获取会话名称
  // @param sessionId - 会话的唯一标识符
  const getSessionName = (sessionId: string) => {
    const createMessageStore = useCreateMessageStore()
    return createMessageStore.chatSessions.find(session => session.sessionId === sessionId)?.name || ''
  }

  return {
    currentSessionId: computed(() => mainStore.currentSessionId),
    getCurrentSessionMessages,
    switchSession,
    addMessageToSession,
    clearSessionMessages,
    getSessionName
  }
})