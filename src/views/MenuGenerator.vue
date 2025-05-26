<template>
  <el-card>
    <el-input-number v-model="days" :min="1" label="天数" />
    <el-button type="primary" @click="handleGenerateMenu">生成菜单</el-button>

    <div v-for="(day, index) in menu" :key="index" style="margin-top: 20px">
      <h4>第 {{ index + 1 }} 天</h4>
      <p>荤菜：{{ day.meat.map(d => d.name).join('，') }}</p>
      <p>素菜：{{ day.vegetable.map(d => d.name).join('，') }}</p>
      <p>汤：{{ day.soup[0].name }}</p>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { generateMenu } from '../api'

const days = ref(3)
const menu = ref([])

const handleGenerateMenu = async () => {
  menu.value = await generateMenu(days.value)
}
</script>
