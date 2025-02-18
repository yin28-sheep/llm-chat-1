<template>
  <!-- 主页面容器，采用flex布局实现左右分栏结构 -->
  <div class="home-container">
    <!-- 左侧消息历史记录组件 -->
    <message-history />
    <!-- 右侧聊天主界面容器 -->
    <div class="chat-container">
      <chat />
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入聊天组件和消息历史记录组件
import Chat from './chat.vue'
import MessageHistory from './MessageHistory.vue'
</script>

<style scoped>
/* 主容器样式，采用flex布局 */
.home-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 右侧聊天界面容器样式 */
.chat-container {
  flex: 1;
  display: flex;
}
</style>