// 新建会话组件：负责创建新的聊天会话
<template>
  <div class="create-message">
    <!-- 新建会话按钮，仅在非创建状态显示 -->
    <button class="create-button" @click="handleCreateClick" v-if="!isCreatingNewSession">
      <span class="plus-icon">+</span>
      <span>新建会话</span>
    </button>
    <!-- 会话名称输入组件，仅在创建状态显示 -->
    <create-message-in ref="inputRef" v-if="isCreatingNewSession" />
    <!-- 确认按钮组件，仅在创建状态显示 -->
    <create-message-button v-if="isCreatingNewSession" :onConfirm="handleConfirmSession" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreateMessageStore } from '../store/CreateMessageStore'
import CreateMessageIn from './CreateMessageIn.vue'
import CreateMessageButton from './CreateMessageButton.vue'

// 组件状态管理
const store = useCreateMessageStore() // 初始化创建会话状态管理store
const { isCreatingNewSession } = storeToRefs(store) // 获取创建状态
const inputRef = ref() // 输入组件引用

// 处理新建会话点击事件
const handleCreateClick = () => {
  store.setCreatingNewSession(true)
}

// 处理会话确认事件
const handleConfirmSession = () => {
  inputRef.value?.handleConfirm()
}
</script>

<style scoped>
/* 创建会话容器样式 */
.create-message {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

/* 创建按钮样式 */
.create-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* 创建按钮悬停效果 */
.create-button:hover {
  background-color: #0056b3;
}

/* 加号图标样式 */
.plus-icon {
  font-size: 18px;
  font-weight: bold;
}
</style>