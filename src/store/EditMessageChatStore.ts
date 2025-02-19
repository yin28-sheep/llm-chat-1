import { defineStore } from 'pinia'

// 定义会话编辑相关的store
export const useEditMessageStore = defineStore('editMessage', () => {
  // 重命名会话
  const renameSession = (sessions: any[], sessionId: string, newName: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      session.name = newName
    }
  }

  // 删除会话
  const deleteSession = (sessions: any[], sessionId: string) => {
    const index = sessions.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      sessions.splice(index, 1)
    }
  }

  return {
    renameSession,
    deleteSession
  }
})