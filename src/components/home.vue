<template>
  <!-- 主页面容器，采用flex布局实现左右分栏结构 -->
  <div class="home-container">
    <!-- 左侧消息历史记录组件 -->
    <sidebar />
    <!-- 右侧主界面容器，负责三种形态的切换 -->
    <div class="main-container">
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入主界面组件和侧边栏组件
import Main from './main.vue'
import Sidebar from './SideBar.vue'
</script>

<style scoped>
@import '@/styles/home.css';
</style>