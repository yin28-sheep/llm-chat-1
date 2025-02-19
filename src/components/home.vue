<template>
  <!-- 主页面容器，采用flex布局实现左右分栏结构 -->
  <div class="home-container">
    <!-- 左侧消息历史记录组件 -->
    <sidebar />
    <!-- 右侧聊天主界面容器 -->
    <div class="chat-container">
      <chat />
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入聊天组件和侧边栏组件
import Chat from './chat.vue'
import Sidebar from './SideBar.vue'
</script>

<style scoped>
@import '@/styles/home.css';
</style>