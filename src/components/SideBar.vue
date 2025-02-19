<template>
  <div class="sidebar">
    <Tools />
    <CreateMessage />
    <HistoryList />
  </div>
</template>

<script setup lang="ts">
import Tools from './Tools.vue'
import CreateMessage from './CreateMessage.vue'
import HistoryList from './HistoryList.vue'
</script>

<style scoped>
@import '@/styles/SideBar.css';
</style>