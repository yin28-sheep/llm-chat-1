<template>
  <home/>
</template>

<script lang="ts" setup>
import Home from "./components/home.vue";
</script>

<style scoped>
.app {
  background-color: aqua;
}

/* 全局样式文件（如 main.css 或 App.vue） */
:root {
  --text-primary: #333; /* 定义文本主色 */
  --link-color: #007bff; /* 定义链接颜色 */
}
</style>