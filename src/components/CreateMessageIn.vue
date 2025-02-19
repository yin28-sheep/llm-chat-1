<template>
  <div class="create-message-input" v-if="isCreatingNewSession">
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

const store = useCreateMessageStore()
const { isCreatingNewSession } = storeToRefs(store)
const sessionName = ref('')

const handleConfirm = () => {
  const trimmedName = sessionName.value.trim()
  if (trimmedName) {
    store.createNewSession(trimmedName)
    emitter.emit('session-name-change', trimmedName)
    sessionName.value = ''
  }
}

defineExpose({
  handleConfirm
})
</script>

<style scoped>
@import '@/styles/CreateMessageIn.css';
</style>