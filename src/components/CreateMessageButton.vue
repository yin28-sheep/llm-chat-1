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
@import '@/styles/CreateMessageButton.css';
</style>