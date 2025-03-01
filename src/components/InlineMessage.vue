<template>
  <div class="inline-message">
    <div class="chat-log">
      <template v-for="(message, index) in messages" :key="index">
        <ChatMessageUser v-if="message.role === 'user'" :message="message" />
        <ChatMessageChat v-else :message="message" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatMessageUser from './ChatMessageUser.vue';
import ChatMessageChat from './ChatMessageChat.vue';

defineProps<{
  messages: Array<{
    role: string;
    content: string;
  }>;
}>();
</script>

<style scoped>
@import'@/styles/InlineMessage.css'
</style>