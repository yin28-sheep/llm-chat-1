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
.sidebar {
  width: 300px;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}
</style>