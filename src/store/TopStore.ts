// MainStore.ts
// 顶层状态管理，负责管理全局共享状态
// 主要功能包括：
// 1. 管理当前会话ID
// 2. 管理全局共享状态和消息队列
// 3. 提供状态访问和修改方法
// 4. 管理应用形态切换（search/dialog/chat）

import { defineStore } from 'pinia'
import type { Message } from '../types/chatMessages'

// 定义并导出顶层状态管理store
export const useMainStore = defineStore('main', {
  state: () => ({
    currentSessionId: null as string | null,
    sessionIds: [] as string[],
    activeMode: 'chat' as 'search' | 'dialog' | 'chat',
    sessionMessages: {} as { [key: string]: Message[] },
    userInput: ''
  }),

  getters: {
    // 获取当前活动模式
    getCurrentMode: (state) => state.activeMode,
    // 判断是否为搜索模式
    isSearchMode: (state) => state.activeMode === 'search',
    // 判断是否为对话模式
    isDialogMode: (state) => state.activeMode === 'dialog',
    // 判断是否为聊天模式
    isChatMode: (state) => state.activeMode === 'chat'
  },

  actions: {
    // 设置当前会话ID
    setCurrentSessionId(sessionId: string) {
      this.currentSessionId = sessionId
      if (!this.sessionIds.includes(sessionId)) {
        this.sessionIds.push(sessionId)
      }
    },

    // 添加新的会话ID
    addSessionId(sessionId: string) {
      if (!this.sessionIds.includes(sessionId)) {
        this.sessionIds.push(sessionId)
      }
    },

    // 删除会话ID
    removeSessionId(sessionId: string) {
      const index = this.sessionIds.indexOf(sessionId)
      if (index > -1) {
        this.sessionIds.splice(index, 1)
        if (this.currentSessionId === sessionId) {
          this.currentSessionId = this.sessionIds.length > 0 ? this.sessionIds[0] : null
        }
      }
    },

    // 检查会话ID是否存在
    hasSessionId(sessionId: string) {
      return this.sessionIds.includes(sessionId)
    },

    // 设置当前活动模式
    setActiveMode(mode: 'search' | 'dialog' | 'chat') {
      this.activeMode = mode
    }
  }
})