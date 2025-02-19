<template>
  <div class="history-list">
    <history-list-chat
      v-for="session in chatSessions"
      :key="session.id"
      :session="session"
      :is-active="currentSessionId === session.id"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCreateMessageStore } from '../store/CreateMessageStore'
import HistoryListChat from './HistoryListChat.vue'

const store = useCreateMessageStore()
const { chatSessions, currentSessionId } = storeToRefs(store)

</script>

<style scoped>
@import '@/styles/HistoryList.css';
</style>