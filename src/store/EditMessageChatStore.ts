// 对话框的删除管理
import { defineStore } from 'pinia'
import { useMainStore } from './TopStore'
import { useSessionStore } from './SessionStore'

// 定义会话编辑相关的store
export const useEditMessageStore = defineStore('editMessage', () => {
  const mainStore = useMainStore()  // 引入TopStore
  const sessionStore = useSessionStore()  // 引入SessionStore

  // 重命名会话
  const renameSession = (sessions: any[], sessionId: string, newName: string) => {
    const session = sessions.find(s => s.sessionId === sessionId)
    if (session) {
      session.name = newName
      // 同步更新SessionStore中的会话名称
      if (mainStore.sessionMessages[sessionId]) {
        mainStore.sessionMessages[sessionId] = mainStore.sessionMessages[sessionId].map(msg => ({
          ...msg,
          sessionName: newName
        }))
      }
    }
  }

  // 删除会话
  const deleteSession = (sessions: any[], sessionId: string) => {
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
    renameSession,
    deleteSession
  }
})