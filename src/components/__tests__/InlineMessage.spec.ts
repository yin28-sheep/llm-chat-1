import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InlineMessage from '../InlineMessage.vue'
import ChatMessageUser from '../ChatMessageUser.vue'
import ChatMessageChat from '../ChatMessageChat.vue'

describe('InlineMessage组件', () => {
  // 测试数据
  const testMessages = [
    { role: 'user', content: '你好' },
    { role: 'assistant', content: '你好，有什么可以帮助你的？' }
  ]

  it('应该正确渲染组件', () => {
    const wrapper = mount(InlineMessage, {
      props: {
        messages: testMessages
      }
    })
    
    // 验证组件是否被正确渲染
    expect(wrapper.find('.inline-message').exists()).toBe(true)
    expect(wrapper.find('.chat-log').exists()).toBe(true)
  })

  it('应该正确渲染用户和AI消息', () => {
    const wrapper = mount(InlineMessage, {
      props: {
        messages: testMessages
      },
      global: {
        stubs: {
          ChatMessageUser: true,
          ChatMessageChat: true
        }
      }
    })
    
    // 验证消息组件是否被正确渲染
    const userMessages = wrapper.findAllComponents({ name: 'ChatMessageUser' })
    const aiMessages = wrapper.findAllComponents({ name: 'ChatMessageChat' })
    
    expect(userMessages.length).toBe(1)
    expect(aiMessages.length).toBe(1)
  })

  it('应该将正确的消息传递给子组件', async () => {
    const wrapper = mount(InlineMessage, {
      props: {
        messages: testMessages
      }
    })
    
    // 获取子组件
    const userMessageComponent = wrapper.findComponent(ChatMessageUser)
    const chatMessageComponent = wrapper.findComponent(ChatMessageChat)
    
    // 验证传递给子组件的props是否正确
    expect(userMessageComponent.props('message')).toEqual(testMessages[0])
    expect(chatMessageComponent.props('message')).toEqual(testMessages[1])
  })

  it('应该能够处理空消息数组', () => {
    const wrapper = mount(InlineMessage, {
      props: {
        messages: []
      }
    })
    
    // 验证组件是否被正确渲染，但没有消息组件
    expect(wrapper.find('.inline-message').exists()).toBe(true)
    expect(wrapper.find('.chat-log').exists()).toBe(true)
    expect(wrapper.findComponent(ChatMessageUser).exists()).toBe(false)
    expect(wrapper.findComponent(ChatMessageChat).exists()).toBe(false)
  })
})