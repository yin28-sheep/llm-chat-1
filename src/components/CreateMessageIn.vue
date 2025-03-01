// 新建会话输入组件：负责会话名称的输入和创建功能
<template>
  <!-- 会话名称输入容器，仅在创建新会话状态显示 -->
  <div v-if="isCreatingNewSession" class="create-message-input">
    <!-- 会话名称输入框：用于输入新会话的名称 -->
    <input
      v-model="sessionName"
      type="text"
      class="input"
      placeholder="请输入会话名称"
      @keyup.enter="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreateMessageStore } from '../store/CreateMessageStore'
import emitter from '../utils/CreateMessageMitter'

// 初始化状态管理store
const store = useCreateMessageStore()
// 从store中获取创建状态
const { isCreatingNewSession } = storeToRefs(store)
// 会话名称输入值状态
const sessionName = ref('')

// 处理确认创建事件
// 验证并创建新会话，同时发送会话名称变更事件
const handleConfirm = () => {
  const trimmedName = sessionName.value.trim()
  if (trimmedName) {
    // 创建新会话
    store.createNewSession(trimmedName)
    // 触发会话名称变更事件
    emitter.emit('session-name-change', trimmedName)
    // 清空输入框
    sessionName.value = ''
  }
}

// 暴露确认方法供父组件调用
defineExpose({
  handleConfirm
})
</script>

<style scoped>

@import '@/styles/CreateMessageIn.css';

</style>