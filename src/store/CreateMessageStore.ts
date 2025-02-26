// 聊天会话状态管理模块
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { switchToChat } from '../utils/ListChatToMitter'
import { useMainStore } from './TopStore'

// 创建并导出会话管理store
export const useCreateMessageStore = defineStore('createMessage', () => {
  // 状态定义
  const isCreatingNewSession = ref(false)  // 是否正在创建新会话
  const mainStore = useMainStore()  // 引入TopStore
  const sessionNames = ref<{ [key: string]: string }>({})  // 存储会话名称

  // 创建新会话
  function createNewSession(name: string) {
    const sessionId = Date.now().toString()  // 使用时间戳作为会话ID
    mainStore.addSessionId(sessionId)  // 添加新会话ID到TopStore
    mainStore.setCurrentSessionId(sessionId)  // 设置当前会话ID
    if (!mainStore.sessionMessages[sessionId]) {
      mainStore.sessionMessages[sessionId] = []
    }
    sessionNames.value[sessionId] = name  // 存储会话名称
    isCreatingNewSession.value = false
    // 自动触发切换会话事件
    switchToChat({
      sessionId,
      title: name
    })
  }

  // 获取所有会话列表
  const chatSessions = computed(() => {
    return mainStore.sessionIds.map(id => ({
      sessionId: id,
      name: sessionNames.value[id] || mainStore.sessionMessages[id]?.[0]?.content || id,
      messages: mainStore.sessionMessages[id] || []
    }))
  })

  // 设置创建会话状态
  const setCreatingNewSession = (status: boolean) => {
    isCreatingNewSession.value = status
  }

  // 选择会话
  const selectSession = (sessionId: string) => {
    if (mainStore.hasSessionId(sessionId)) {
      mainStore.setCurrentSessionId(sessionId)
    }
  }

  // 获取当前选中的会话
  const getCurrentSession = () => {
    if (!mainStore.currentSessionId) return null
    const messages = mainStore.sessionMessages[mainStore.currentSessionId] || []
    return {
      sessionId: mainStore.currentSessionId,
      name: messages[0]?.content || mainStore.currentSessionId,
      messages
    }
  }

  // 导出状态和方法
  return {
    chatSessions,
    isCreatingNewSession,
    createNewSession,
    setCreatingNewSession,
    selectSession,
    getCurrentSession,
  }
})