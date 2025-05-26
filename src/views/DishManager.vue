<template>
  <el-card>
    <el-button type="primary" @click="showForm = true">添加菜品</el-button>
    <el-table :data="dishes" style="margin-top: 20px">
      <el-table-column prop="name" label="菜名" />
      <el-table-column prop="type" label="类型" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" @click="deleteDish(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <DishForm v-model:visible="showForm" @refresh="fetchDishes" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDishes, deleteDishById } from '../api'
import DishForm from '../components/DishForm.vue'

const dishes = ref([])
const showForm = ref(false)

const fetchDishes = async () => {
  dishes.value = await getDishes()
}

const deleteDish = async (id) => {
  await deleteDishById(id)
  fetchDishes()
}

onMounted(fetchDishes)
</script>
