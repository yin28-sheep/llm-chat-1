<template>
  <div class="create-message-button" v-if="isCreatingNewSession">
    <button class="confirm-button" @click="handleConfirm">
      <span>确认</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCreateMessageStore } from '../store/CreateMessageStore'

const store = useCreateMessageStore()
const { isCreatingNewSession } = storeToRefs(store)

const props = defineProps<{
  onConfirm: () => void
}>()

const handleConfirm = () => {
  props.onConfirm()
  store.setCreatingNewSession(false)
}
</script>

<style scoped>
.create-message-button {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.confirm-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button:hover {
  background-color: #0056b3;
}
</style>