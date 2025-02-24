// CoreStore.ts
// 负责应用的核心模式切换功能
// 主要功能包括：
// 1. 管理当前应用形态（search/dialog/chat）
// 2. 提供切换不同形态的方法

import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义模式类型
type Mode = 'search' | 'dialog' | 'chat'

// 定义并导出核心状态管理store
export const useCoreStore = defineStore('core', () => {
  // 当前模式，默认为search
  const currentMode = ref<Mode>('search')

  // 设置当前模式
  const setMode = (mode: Mode) => {
    currentMode.value = mode
  }

  return {
    currentMode,
    setMode
  }
})