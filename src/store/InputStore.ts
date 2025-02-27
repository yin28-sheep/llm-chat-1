// InputStore.ts
// 负责用户输入框的状态管理
// 主要功能包括：
// 1. 管理输入框的文本内容
// 2. 提供设置和清空输入文本的方法

import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义并导出输入框状态管理store
export const useInputStore = defineStore('input', () => {
  // 输入框文本内容
  const inputText = ref('')

  // 设置输入文本
  const setInputText = (text: string) => {
    inputText.value = text
  }

  // 清空输入文本
  const clearInputText = () => {
    inputText.value = ''
  }

  // 获取当前输入文本
  const getCurrentText = () => inputText.value

  return {
    inputText,
    setInputText,
    clearInputText,
    getCurrentText
  }
})