<template>
  <div class="history-item" :class="{ 'active': isActive }" @click="handleClick">
    <!-- 会话名称显示/编辑区域 -->
    <div v-if="!isEditing" class="message-preview">
      {{ session.name }}
    </div>
    <input
      v-else
      v-model="editingName"
      class="edit-input"
      @keyup.enter="handleRename"
      @blur="handleRename"
      ref="inputRef"
    />
    
    <!-- 操作按钮区域 -->
    <div class="actions" v-show="!isEditing">
      <button class="action-btn" @click.stop="startEditing">
        <span>重命名</span>
      </button>
      <button class="action-btn delete" @click.stop="handleDelete">
        <span>删除</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useCreateMessageStore } from '../store/CreateMessageStore'
import { useEditMessageStore } from '../store/editMessageChat'

interface Props {
  session: {
    id: string
    name: string
  }
  isActive: boolean
}

const props = defineProps<Props>()
const store = useCreateMessageStore()
const editStore = useEditMessageStore()

// 编辑状态管理
const isEditing = ref(false)
const editingName = ref(props.session.name)
const inputRef = ref<HTMLInputElement | null>(null)

// 开始编辑会话名称
const startEditing = () => {
  isEditing.value = true
  editingName.value = props.session.name
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 处理重命名
const handleRename = () => {
  const newName = editingName.value.trim()
  if (newName && newName !== props.session.name) {
    editStore.renameSession(store.chatSessions, props.session.id, newName)
  }
  isEditing.value = false
}

// 处理删除
const handleDelete = () => {
  if (confirm('确定要删除这个会话吗？')) {
    editStore.deleteSession(store.chatSessions, props.session.id)
  }
}

// 处理点击
const handleClick = () => {
  if (!isEditing.value) {
    store.selectSession(props.session.id)
  }
}
</script>

<style scoped>
@import '@/styles/HistoryListChat.css';
</style>