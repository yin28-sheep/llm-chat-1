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
.history-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-item:hover {
  background-color: #f8f8f8;
}

.history-item.active {
  background-color: #e8f4ff;
}

.message-preview {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .actions {
  opacity: 1;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  background: #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #d8d8d8;
}

.action-btn.delete:hover {
  background: #ff4d4f;
  color: white;
}

.edit-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 8px;
}

.edit-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
</style>