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
@import'@/styles/InlineMessage.css'
</style>