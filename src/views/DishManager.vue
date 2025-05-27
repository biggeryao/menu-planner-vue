<template>
  <el-card v-loading="loading" shadow="hover">
    <div class="flex justify-between items-center mb-4">
      <div>
        <el-button type="primary" @click="showForm = true">添加菜品</el-button>
        <el-button type="danger" @click="confirmBatchDelete" :disabled="multipleSelection.length === 0">批量删除
        </el-button>
      </div>
      <el-input
          v-model="searchInput"
          placeholder="请输入菜名搜索"
          clearable
          style="width: 300px;margin-top: 15px;"
      />
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane :label="`🥩 荤菜 (${filteredMeat.length})`" name="meat">
        <el-table
            :data="filteredMeat"
            height="630"
            size="small"
            empty-text="暂无荤菜"
            @selection-change="handleSelectionChange"
            ref="meatTableRef"
            :row-key="row => row._id"
            style="width: 100%"
            :default-sort="{ prop: 'count', order: 'ascending' }"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="name" label="菜名">
            <template #default="{ row }">
              <span v-html="highlight(row.name)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="安排次数" sortable
                           :sort-method="(a, b) => b.count - a.count"
          />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="confirmDelete(row._id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`🥬 素菜 (${filteredVegetable.length})`" name="vegetable">
        <el-table
            :data="filteredVegetable"
            height="630"
            size="small"
            empty-text="暂无素菜"
            @selection-change="handleSelectionChange"
            ref="vegetableTableRef"
            :row-key="row => row._id"
            style="width: 100%"
            :default-sort="{ prop: 'count', order: 'ascending' }"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="name" label="菜名">
            <template #default="{ row }">
              <span v-html="highlight(row.name)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="安排次数" sortable
                           :sort-method="(a, b) => b.count - a.count"
          />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="confirmDelete(row._id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`🍲 汤类 (${filteredSoup.length})`" name="soup">
        <el-table
            :data="filteredSoup"
            height="630"
            size="small"
            empty-text="暂无汤类"
            @selection-change="handleSelectionChange"
            ref="soupTableRef"
            :row-key="row => row._id"
            style="width: 100%"
            :default-sort="{ prop: 'count', order: 'ascending' }"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="name" label="菜名">
            <template #default="{ row }">
              <span v-html="highlight(row.name)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="安排次数" sortable
                           :sort-method="(a, b) => b.count - a.count"
          />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="confirmDelete(row._id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <DishForm v-model:visible="showForm" @refresh="fetchDishes" />
  </el-card>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import debounce from 'lodash/debounce'
import {getDishes, deleteDishById, batchDeleteDishes} from '../api'
import DishForm from '../components/DishForm.vue'

const dishes = ref([])
const loading = ref(false)
const showForm = ref(false)
const activeTab = ref('meat')
const searchInput = ref('')
const searchKeyword = ref('')
const multipleSelection = ref([])

// 表格 refs
const meatTableRef = ref(null)
const vegetableTableRef = ref(null)
const soupTableRef = ref(null)

// 防抖更新关键字
const updateKeyword = debounce(val => {
  searchKeyword.value = val.trim().toLowerCase()
}, 300)
watch(searchInput, val => updateKeyword(val))

const fetchDishes = async () => {
  loading.value = true
  try {
    dishes.value = await getDishes()
    clearSelections()
  } catch (err) {
    ElMessage.error('获取菜品失败')
  } finally {
    loading.value = false
  }
}

const confirmDelete = id => {
  ElMessageBox.confirm('确定要删除该菜品吗？', '删除确认', {type: 'warning'})
      .then(async () => {
        try {
          await deleteDishById(id)
          ElMessage.success('删除成功')
          fetchDishes()
        } catch {
          ElMessage.error('删除失败')
        }
      })
      .catch(() => {
      })
}

const handleSelectionChange = val => {
  multipleSelection.value = val
}

const confirmBatchDelete = () => {
  ElMessageBox.confirm(
      `确认要删除选中的 ${multipleSelection.value.length} 个菜品吗？`,
      '批量删除确认',
      {type: 'warning'}
  )
      .then(async () => {
        const ids = multipleSelection.value.map(item => item._id)
        try {
          await batchDeleteDishes(ids)
          ElMessage.success('批量删除成功')
          fetchDishes()
        } catch {
          ElMessage.error('批量删除失败')
        }
      })
      .catch(() => {
      })
}

const filterByType = type =>
    dishes.value.filter(
        d => d.type === type && d.name.toLowerCase().includes(searchKeyword.value)
    )

const filteredMeat = computed(() => filterByType('meat'))
const filteredVegetable = computed(() => filterByType('vegetable'))
const filteredSoup = computed(() => filterByType('soup'))

// 高亮搜索关键词
const highlight = name => {
  if (!searchKeyword.value) return name
  const re = new RegExp(`(${searchKeyword.value})`, 'gi')
  return name.replace(re, '<span class="text-red-500">$1</span>')
}

const clearSelections = () => {
  meatTableRef.value && meatTableRef.value.clearSelection()
  vegetableTableRef.value && vegetableTableRef.value.clearSelection()
  soupTableRef.value && soupTableRef.value.clearSelection()
}

onMounted(fetchDishes)
</script>

<style scoped>
.el-table__empty-text {
  text-align: center;
  color: #999;
}
</style>
