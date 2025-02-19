// 聊天相关类型定义

// 消息角色类型
export type MessageRole = 'user' | 'assistant'

// 消息接口
export interface Message {
  role: MessageRole
  content: string
}

// 聊天会话接口
export interface ChatSession {
  id: string      // 会话唯一标识
  name: string    // 会话名称
  messages: Message[]  // 会话消息列表
}

// 会话消息映射接口
export interface SessionMessages {
  [sessionId: string]: Message[]
}

// 聊天信息接口
export interface ChatInfo {
  id: string
  title: string
}