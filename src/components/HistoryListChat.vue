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
      ref="inputRef"
      v-model="editingName"
      class="edit-input"
      @keyup.enter="handleRename"
      @blur="handleRename"
    />
    
    <!-- 操作按钮区域：重命名和删除 -->
    <div v-show="!isEditing" class="actions">
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
import { useEditMessageStore } from '../store/EditMessageChatStore'
import { useSessionStore } from '../store/SessionStore'
import { switchToChat, deleteChat, renameChat } from '../utils/ListChatToMitter'

// 定义组件接收的属性
interface Props {
  session: {
    sessionId: string    // 会话ID
    name: string  // 会话名称
  }
  isActive: boolean  // 是否为当前激活的会话
}

const props = defineProps<Props>()

// 初始化状态管理store
const store = useSessionStore()
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
  const newName = editingName.value.trim();
  console.log('New Name:', newName); // 添加日志输出
  console.log('Old Name:', props.session.name); // 添加日志输出

  if (newName && newName !== props.session.name) {
    store.renameSession(store.chatSessions, props.session.sessionId, newName);
    renameChat(props.session.sessionId, newName);
  } else if (newName === props.session.name) {
    console.warn('新名称与旧名称相同');
  } else {
    console.warn('新名称不能为空');
  }
  isEditing.value = false;
};

// 处理删除操作
// 确认后删除会话并通知其他组件
const handleDelete = () => {
  if (confirm('确定要删除这个会话吗？')) {
    editStore.deleteSession(store.chatSessions, props.session.sessionId)
    // 触发删除事件，通知其他组件更新
    deleteChat(props.session.sessionId)
  }
}

// 处理会话点击事件
// 切换到选中的会话
const handleClick = () => {
  if (!isEditing.value) {
    store.selectSession(props.session.sessionId)
    // 使用mitt事件总线触发切换会话事件
    switchToChat({
      sessionId: props.session.sessionId,
      title: props.session.name
    })
  }
}
</script>

<style scoped>
@import '@/styles/HistoryListChat.css';
</style>

