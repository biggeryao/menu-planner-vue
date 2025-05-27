<template>
  <el-container style="height: 100vh;">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="sidebar">
      <div class="logo-container">
<!--        <img src="/logo.png" alt="Logo" class="logo" />-->
        <h1 class="title">菜单管理</h1>
      </div>
      <el-menu
          :default-active="activeMenu"
          router
          class="menu"
          background-color="#2d3a4b"
          text-color="#bfcbd9"
          active-text-color="#ffd04b"
      >
        <el-menu-item index="/dishes">
          <i class="el-icon-menu"></i>
          <span>总菜单</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <i class="el-icon-date"></i>
          <span>生成菜单</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <el-header class="header">
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ breadcrumb }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
const breadcrumb = computed(() => {
  switch (route.path) {
    case '/dishes': return '总菜单'
    case '/menu': return '生成菜单'
    default: return ''
  }
})
</script>

<style scoped>
.sidebar {
  background-color: #2d3a4b;
  color: #bfcbd9;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  padding: 0 10px;
}
.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.title {
  font-size: 18px;
  color: #e6e6e6;
  margin: 0;
}
.menu {
  border-right: none;
}
.header {
  background-color: #fff;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
}
.breadcrumb {
  line-height: 64px;
}
.main-content {
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>
