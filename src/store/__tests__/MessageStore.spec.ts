import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMessageStore } from '../MessageStore'
import { useMainStore } from '../TopStore'

// 模拟TopStore
vi.mock('../TopStore', () => {
  const sessionMessages = { 'test-session': [] };
  return {
    useMainStore: () => ({
      currentSessionId: 'test-session',
      sessionMessages,
      setCurrentSessionId: vi.fn(),
      // 实现一个可变的sessionMessages对象，使其能够被测试修改
      get sessionMessages() {
        return sessionMessages;
      }
    })
  };
})

describe('MessageStore', () => {
  beforeEach(() => {
    // 创建一个新的Pinia实例并将其设置为活动实例
    setActivePinia(createPinia())
  })

  it('应该初始化为非加载状态', () => {
    const messageStore = useMessageStore()
    expect(messageStore.isLoading).toBe(false)
  })

  it('应该能够添加消息到当前会话', () => {
    const messageStore = useMessageStore()
    const mainStore = useMainStore()
    
    // 添加一条用户消息
    const message = { role: 'user', content: '你好', sessionId: 'test-session' }
    messageStore.addMessage(message)
    
    // 验证消息是否被添加到正确的会话
    expect(mainStore.sessionMessages['test-session']).toHaveLength(1)
    expect(mainStore.sessionMessages['test-session'][0]).toEqual(message)
  })

  it('应该能够清空当前会话的消息', () => {
    const messageStore = useMessageStore()
    const mainStore = useMainStore()
    
    // 先添加一条消息
    mainStore.sessionMessages['test-session'] = [
      { role: 'user', content: '你好', sessionId: 'test-session' }
    ]
    
    // 清空消息
    messageStore.clearMessages()
    
    // 验证消息是否被清空
    expect(mainStore.sessionMessages['test-session']).toEqual([])
  })

  it('应该能够设置加载状态', () => {
    const messageStore = useMessageStore()
    
    // 设置为加载中
    messageStore.setLoading(true)
    expect(messageStore.isLoading).toBe(true)
    
    // 设置为非加载中
    messageStore.setLoading(false)
    expect(messageStore.isLoading).toBe(false)
  })

  it('应该能够处理流式响应', () => {
    const messageStore = useMessageStore()
    const mainStore = useMainStore()
    
    // 添加一条AI消息
    mainStore.sessionMessages['test-session'] = [
      { role: 'assistant', content: '', sessionId: 'test-session' }
    ]
    
    // 处理流式响应
    messageStore.handleStreamingResponse('正在思考...')
    
    // 验证消息内容是否被更新
    expect(messageStore.streamContent).toBe('正在思考...')
    expect(mainStore.sessionMessages['test-session'][0].content).toBe('正在思考...')
  })
})