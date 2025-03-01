// 对话框的删除管理
import { defineStore } from 'pinia'
import { useMainStore } from './TopStore'
import { useSessionStore } from './SessionStore'

// 定义会话编辑相关的store
export const useEditMessageStore = defineStore('editMessage', () => {
  const mainStore = useMainStore()  // 引入TopStore
  const sessionStore = useSessionStore()  // 引入SessionStore


  // 删除会话
  const deleteSession = (sessions: {sessionId: string}[], sessionId: string) => {
    const index = sessions.findIndex(s => s.sessionId === sessionId)
    if (index !== -1) {
      sessions.splice(index, 1)
      // 从TopStore中删除会话ID
      mainStore.removeSessionId(sessionId)
      // 清除相关消息
      if (mainStore.sessionMessages[sessionId]) {
        delete mainStore.sessionMessages[sessionId]
      }
      // 如果删除的是当前会话，切换到其他会话
      if (mainStore.currentSessionId === sessionId) {
        const nextSessionId = mainStore.sessionIds[0]
        if (nextSessionId) {
          sessionStore.switchSession(nextSessionId)
        }
      }
    }
  }

  return {
    deleteSession
  }
})