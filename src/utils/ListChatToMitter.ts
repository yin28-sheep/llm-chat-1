import mitt from 'mitt'

type Events = {
  switchChat: { id: string; title: string }
  createChat: void
  deleteChat: string  // 删除会话事件，参数为会话ID
  renameChat: { id: string; newTitle: string }  // 重命名会话事件，参数包含会话ID和新标题
}

const emitter = mitt<Events>()

// 切换聊天会话
export const switchToChat = (chatInfo: { id: string; title: string }) => {
  emitter.emit('switchChat', chatInfo)
}

// 创建新的聊天会话
export const createNewChat = () => {
  emitter.emit('createChat')
}

// 删除聊天会话
export const deleteChat = (sessionId: string) => {
  emitter.emit('deleteChat', sessionId)
}

// 重命名聊天会话
export const renameChat = (sessionId: string, newTitle: string) => {
  emitter.emit('renameChat', { id: sessionId, newTitle })
}

// 监听切换聊天事件
export const onSwitchChat = (callback: (chatInfo: { id: string; title: string }) => void) => {
  emitter.on('switchChat', callback)
}

// 监听创建聊天事件
export const onCreateChat = (callback: () => void) => {
  emitter.on('createChat', callback)
}

// 监听删除聊天事件
export const onDeleteChat = (callback: (sessionId: string) => void) => {
  emitter.on('deleteChat', callback)
}

// 监听重命名聊天事件
export const onRenameChat = (callback: (info: { id: string; newTitle: string }) => void) => {
  emitter.on('renameChat', callback)
}

// 移除事件监听
export const removeListener = (eventName: keyof Events) => {
  emitter.off(eventName)
}

export { emitter }