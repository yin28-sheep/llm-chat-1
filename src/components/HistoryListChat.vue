<template>
  <!-- 历史会话列表项组件 -->
  <div class="history-item" :class="{ 'active': isActive }" @click="handleClick">
    <!-- 会话名称显示/编辑区域 -->
    <div v-if="!isEditing" class="message-preview">
      {{ session.name }}
    </div>
    <!-- 会话名称编辑输入框，仅在编辑状态显示 -->
    <input
      v-else
      v-model="editingName"
      class="edit-input"
      @keyup.enter="handleRename"
      @blur="handleRename"
      ref="inputRef"
    />
    
    <!-- 操作按钮区域：重命名和删除 -->
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
import { useEditMessageStore } from '../store/EditMessageChatStore'
import { switchToChat, deleteChat, renameChat } from '../utils/ListChatToMitter'

// 定义组件接收的属性
interface Props {
  session: {
    id: string    // 会话ID
    name: string  // 会话名称
  }
  isActive: boolean  // 是否为当前激活的会话
}

const props = defineProps<Props>()

// 初始化状态管理store
const store = useCreateMessageStore()
const editStore = useEditMessageStore()

// 编辑状态管理
const isEditing = ref(false)         // 是否处于编辑状态
const editingName = ref(props.session.name)  // 编辑中的会话名称
const inputRef = ref<HTMLInputElement | null>(null)  // 编辑输入框引用

// 开始编辑会话名称
// 激活编辑状态并聚焦输入框
const startEditing = () => {
  isEditing.value = true
  editingName.value = props.session.name
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 处理重命名操作
// 验证新名称并更新会话信息
const handleRename = () => {
  const newName = editingName.value.trim()
  if (newName && newName !== props.session.name) {
    editStore.renameSession(store.chatSessions, props.session.id, newName)
    // 触发重命名事件，通知其他组件更新
    renameChat(props.session.id, newName)
  }
  isEditing.value = false
}

// 处理删除操作
// 确认后删除会话并通知其他组件
const handleDelete = () => {
  if (confirm('确定要删除这个会话吗？')) {
    editStore.deleteSession(store.chatSessions, props.session.id)
    // 触发删除事件，通知其他组件更新
    deleteChat(props.session.id)
  }
}

// 处理会话点击事件
// 切换到选中的会话
const handleClick = () => {
  if (!isEditing.value) {
    store.selectSession(props.session.id)
    // 使用mitt事件总线触发切换会话事件
    switchToChat({
      id: props.session.id,
      title: props.session.name
    })
  }
}
</script>

<style scoped>
@import '@/styles/HistoryListChat.css';
</style>

