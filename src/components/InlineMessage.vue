<template>
  <div class="inline-message">
    <div class="chat-log">
      <ChatMessageUser v-if="role === 'user'" :message="message" />
      <ChatMessageChat v-else :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatMessageUser from './ChatMessageUser.vue';
import ChatMessageChat from './ChatMessageChat.vue';

const props = defineProps<{
  message: {
    role: string;
    content: string;
  };
  role: string;
}>();
</script>

<style scoped>
.inline-message {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.chat-log {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>