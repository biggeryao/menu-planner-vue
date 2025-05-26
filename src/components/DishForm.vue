<template>
  <el-dialog
      :model-value="visible"
      title="批量添加菜品"
      @close="handleClose"
      @update:model-value="emit('update:visible', $event)"
      width="600px"
  >
    <el-form>
      <el-form-item label="菜名（多个菜名用逗号分隔）">
        <el-input
            type="textarea"
            v-model="names"
            placeholder="例如：红烧肉,糖醋排骨,鱼香肉丝"
            rows="4"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="type" placeholder="请选择类型">
          <el-option label="荤菜" value="meat" />
          <el-option label="素菜" value="vegetable" />
          <el-option label="汤" value="soup" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, watch} from 'vue'
import {batchAddDishes} from '../api'  // 假设你有批量添加接口
import {ElMessage} from 'element-plus'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible', 'refresh'])

const names = ref('')
const type = ref('')

// 每次打开弹窗时清空表单
watch(() => props.visible, (val) => {
  if (val) {
    names.value = ''
    type.value = ''
  }
})

const submit = async () => {
  if (!names.value.trim()) {
    ElMessage.error('请输入至少一个菜名')
    return
  }
  if (!type.value) {
    ElMessage.error('请选择菜品类型')
    return
  }

  // 拆分菜名
  const nameList = names.value
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0)

  if (nameList.length === 0) {
    ElMessage.error('请输入有效的菜名')
    return
  }

  const dishes = nameList.map(name => ({name, type: type.value}))

  try {
    await batchAddDishes(dishes)
    ElMessage.success('批量添加成功')
    emit('update:visible', false)
    emit('refresh')
  } catch (err) {
    ElMessage.error('添加失败，请稍后重试')
  }
}

const handleClose = () => {
  emit('update:visible', false)
}
</script>
