<template>
  <el-card>
    <div class="flex items-center gap-4 mb-4">
      <el-date-picker
          v-model="dateRange"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
      />
      <el-button type="primary" @click="fetchMenu" style="margin-left: 10px;">生成菜单</el-button>
      <el-button type="success" :disabled="!menu.length" @click="confirmAndExport">
        确认并导出菜单图
      </el-button>
    </div>

    <div v-for="(day, idx) in menu" :key="idx" class="mb-6">
      <h3 class="text-lg font-bold mb-2">{{ formatDate(menuDates[idx]) }}</h3>
      <el-table :data="flatMenu(day)" border size="small" style="width: 100%">
        <el-table-column prop="typeLabel" label="类型" width="100" />
        <el-table-column label="菜名">
          <template #default="scope">
            <el-select
                v-model="scope.row.dish._id"
                filterable
                placeholder="选择菜品"
                @change="onDishChange(idx, scope.row.type, scope.row.index, scope.row.dish._id)"
                style="width: 100%"
            >
              <el-option
                  v-for="option in getOptionsByType(scope.row.type)"
                  :key="option._id"
                  :label="option.name"
                  :value="option._id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="已排次数">
          <template #default="scope">
            {{ scope.row.dish.count || 0 }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 隐藏 canvas 用于导出 -->
    <canvas ref="exportCanvas" style="display:none;"></canvas>
  </el-card>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import {getDishes, generateMenu, confirmSelections} from '../api'

const dateRange = ref([])
const menu = ref([])
const menuDates = ref([])
const allDishes = ref([])
const exportCanvas = ref(null)

const fetchMenu = async () => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    ElMessage.warning('请选择起止日期')
    return
  }

  const [start, end] = dateRange.value
  const daysCount = Math.ceil((new Date(end) - new Date(start)) / (1000 * 3600 * 24)) + 1

  const rawMenu = await generateMenu(daysCount)
  menu.value = rawMenu
  menuDates.value = Array.from({length: daysCount}, (_, i) => {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    return date
  })
}

const confirmAndExport = async () => {
  // 统计
  const ids = menu.value.flatMap(day =>
      [...day.meat, ...day.vegetable, ...day.soup].map(d => d._id)
  )
  await confirmSelections(ids)
  ElMessage.success('统计完成，正在导出菜单图片')

  await drawMenuImage()
}

const loadAllDishes = async () => {
  allDishes.value = await getDishes()
}

onMounted(loadAllDishes)

// 编辑逻辑
const getOptionsByType = (type) =>
    allDishes.value.filter(d => d.type === type).sort((a, b) => a.count - b.count)

const onDishChange = (dayIndex, type, dishIndex, newId) => {
  const dish = allDishes.value.find(d => d._id === newId)
  if (dish) menu.value[dayIndex][type][dishIndex] = dish
}

const flatMenu = (day) => {
  return ['meat', 'vegetable', 'soup'].flatMap((type) =>
      day[type].map((dish, index) => ({
        type,
        index,
        typeLabel: type === 'meat' ? '肉' : type === 'vegetable' ? '素' : '汤',
        dish
      }))
  )
}

const formatDate = (d) => d.toLocaleDateString('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit'})

// 🎨 导出菜单为图片（使用 Canvas 美化）
const drawMenuImage = async () => {
  const canvas = exportCanvas.value
  const ctx = canvas.getContext('2d')

  const rowHeight = 40
  const daySpacing = 20
  const width = 600
  const padding = 20

  const totalRows = menu.value.reduce((sum, day) => sum + 3 + 1, 0) // 每天标题 + 3 行
  const height = padding * 2 + totalRows * rowHeight + (menu.value.length - 1) * daySpacing

  canvas.width = width
  canvas.height = height

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)
  ctx.font = '16px sans-serif'
  ctx.fillStyle = '#000'

  let y = padding

  for (let i = 0; i < menu.value.length; i++) {
    const day = menu.value[i]
    ctx.fillStyle = '#2c3e50'
    ctx.fillText(`📅 ${formatDate(menuDates.value[i])}`, padding, y)
    y += rowHeight

    for (const type of ['meat', 'vegetable', 'soup']) {
      const label = type === 'meat' ? '肉' : type === 'vegetable' ? '素' : '汤'
      const names = day[type].map(d => d.name).join('、')
      ctx.fillStyle = '#34495e'
      ctx.fillText(`${label}：${names}`, padding + 20, y)
      y += rowHeight
    }

    y += daySpacing
  }

  // 导出图片
  const link = document.createElement('a')
  link.download = `菜单-${formatDate(menuDates.value[0])}至${formatDate(menuDates.value.at(-1))}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>
