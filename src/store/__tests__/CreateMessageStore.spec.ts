import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCreateMessageStore } from '../CreateMessageStore'
import { useMainStore } from '../TopStore'
import { useSessionStore } from '../SessionStore'

// 模拟TopStore
vi.mock('../TopStore', () => {
  const sessionMessages = {};
  const sessionIds = [];
  let currentSessionId = '';
  const addSessionIdMock = vi.fn().mockImplementation((id) => {
    sessionIds.push(id);
  });
  const setCurrentSessionIdMock = vi.fn().mockImplementation((id) => {
    currentSessionId = id;
  });
  return {
    useMainStore: () => ({
      sessionMessages,
      sessionIds,
      get currentSessionId() {
        return currentSessionId;
      },
      addSessionId: addSessionIdMock,
      setCurrentSessionId: setCurrentSessionIdMock
    })
  };
});

// 模拟SessionStore
vi.mock('../SessionStore', () => {
  const setSessionNameMock = vi.fn();
  return {
    useSessionStore: () => ({
      setSessionName: setSessionNameMock
    })
  };
});

// 模拟ListChatToMitter
vi.mock('../../utils/ListChatToMitter', () => ({
  switchToChat: vi.fn()
}));

describe('CreateMessageStore', () => {
  beforeEach(() => {
    // 创建一个新的Pinia实例并将其设置为活动实例
    setActivePinia(createPinia())
    // 重置所有模拟函数
    vi.clearAllMocks()
  })

  it('应该初始化为非创建状态', () => {
    const createMessageStore = useCreateMessageStore()
    expect(createMessageStore.isCreatingNewSession).toBe(false)
  })

  it('应该能够设置创建状态', () => {
    const createMessageStore = useCreateMessageStore()
    
    // 设置为创建状态
    createMessageStore.setCreatingNewSession(true)
    expect(createMessageStore.isCreatingNewSession).toBe(true)
    
    // 设置为非创建状态
    createMessageStore.setCreatingNewSession(false)
    expect(createMessageStore.isCreatingNewSession).toBe(false)
  })

  it('应该能够创建新会话', () => {
    const createMessageStore = useCreateMessageStore()
    const mainStore = useMainStore()
    const sessionStore = useSessionStore()
    
    // 创建新会话
    const sessionName = '测试会话'
    createMessageStore.createNewSession(sessionName)
    
    // 验证是否调用了相关方法
    expect(mainStore.addSessionId).toHaveBeenCalled()
    expect(mainStore.setCurrentSessionId).toHaveBeenCalled()
    expect(sessionStore.setSessionName).toHaveBeenCalled()
    
    // 验证创建状态是否被重置
    expect(createMessageStore.isCreatingNewSession).toBe(false)
  })

  it('创建新会话时应该正确初始化消息数组', () => {
    const createMessageStore = useCreateMessageStore()
    const mainStore = useMainStore()
    
    // 创建新会话
    const sessionName = '测试会话'
    createMessageStore.createNewSession(sessionName)
    
    // 验证消息数组是否被正确初始化
    expect(mainStore.sessionMessages[mainStore.currentSessionId]).toEqual([])
  })
});