import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSessionStore } from '../SessionStore'
import { useMainStore } from '../TopStore'
import type { Message } from '../../types/chatMessages'

// 模拟TopStore
vi.mock('../TopStore', () => {
  // 使用闭包保持状态
  const sessionMessages = { 'test-session': [] };
  let currentId = 'test-session';
  const setCurrentSessionIdMock = vi.fn().mockImplementation((id) => {
    currentId = id;
  });
  
  return {
    useMainStore: () => ({
      get currentSessionId() {
        return currentId;
      },
      sessionIds: ['test-session', 'test-session-2'],
      setCurrentSessionId: setCurrentSessionIdMock,
      hasSessionId: vi.fn().mockImplementation((id) => ['test-session', 'test-session-2'].includes(id)),
      // 使用getter确保sessionMessages可以被测试修改
      get sessionMessages() {
        return sessionMessages;
      }
    })
  };
})

// 在每次测试前重置模拟的sessionMessages
beforeEach(() => {
  // 重置模拟的sessionMessages
  const mainStore = useMainStore();
  // 清空所有会话消息
  Object.keys(mainStore.sessionMessages).forEach(key => {
    mainStore.sessionMessages[key] = [];
  });
})

describe('SessionStore', () => {
  beforeEach(() => {
    // 创建一个新的Pinia实例并将其设置为活动实例
    setActivePinia(createPinia())
    // 重置模拟函数
    vi.clearAllMocks()
  })

  it('应该能够切换会话', () => {
    const sessionStore = useSessionStore()
    const mainStore = useMainStore()
    
    sessionStore.switchSession('test-session-2')
    
    // 验证是否调用了setCurrentSessionId方法
    expect(mainStore.setCurrentSessionId).toHaveBeenCalledWith('test-session-2')
  })

  it('应该能够获取当前会话的消息', () => {
    const sessionStore = useSessionStore()
    const mainStore = useMainStore()
    
    // 设置测试消息
    const testMessages: Message[] = [
      { role: 'user', content: '你好', sessionId: 'test-session' },
      { role: 'assistant', content: '你好，有什么可以帮助你的？', sessionId: 'test-session' }
    ]
    // 确保当前会话ID正确设置
    mainStore.setCurrentSessionId('test-session')
    // 使用push方法添加消息，以确保引用关系正确
    testMessages.forEach(message => {
      if (!mainStore.sessionMessages['test-session']) {
        mainStore.sessionMessages['test-session'] = []
      }
      mainStore.sessionMessages['test-session'].push(message)
    })
    
    // 验证getCurrentSessionMessages是否返回正确的消息
    expect(sessionStore.getCurrentSessionMessages).toEqual(testMessages)
  })

  it('应该能够添加消息到指定会话', () => {
    const sessionStore = useSessionStore()
    const mainStore = useMainStore()
    
    // 确保测试开始前会话消息为空
    mainStore.sessionMessages['test-session'] = []
    
    const message: Message = { role: 'user', content: '新消息', sessionId: 'test-session' }
    sessionStore.addMessageToSession('test-session', message)
    
    // 验证消息是否被添加
    expect(mainStore.sessionMessages['test-session']).toHaveLength(1)
    expect(mainStore.sessionMessages['test-session'][0]).toEqual(message)
  })

  it('应该能够清空指定会话的消息', () => {
    const sessionStore = useSessionStore()
    const mainStore = useMainStore()
    
    // 先添加一条消息
    mainStore.sessionMessages['test-session'] = [
      { role: 'user', content: '你好', sessionId: 'test-session' }
    ]
    
    // 清空消息
    sessionStore.clearSessionMessages('test-session')
    
    // 验证消息是否被清空
    expect(mainStore.sessionMessages['test-session']).toEqual([])
  })

  it('应该能够设置和获取会话名称', () => {
    const sessionStore = useSessionStore()
    
    // 设置会话名称
    sessionStore.setSessionName('test-session', '测试会话')
    
    // 验证会话名称是否被正确设置
    expect(sessionStore.getSessionName('test-session')).toBe('测试会话')
  })

  it('应该能够获取所有会话列表', () => {
    const sessionStore = useSessionStore()
    const mainStore = useMainStore()
    
    // 设置会话名称和消息
    sessionStore.setSessionName('test-session', '测试会话1')
    mainStore.sessionMessages['test-session'] = [
      { role: 'user', content: '你好', sessionId: 'test-session' }
    ]
    
    // 验证chatSessions是否返回正确的会话列表
    expect(sessionStore.chatSessions).toHaveLength(2)
    expect(sessionStore.chatSessions[0].name).toBe('测试会话1')
    expect(sessionStore.chatSessions[0].sessionId).toBe('test-session')
  })
})