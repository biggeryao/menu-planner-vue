import axios from 'axios'

const BASE = 'https://menu-planner-dc8j.onrender.com/api/dishes'

const apiClient = axios.create({
    baseURL: BASE,
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000
})

/** 获取所有菜品 */
export const getDishes = async () => {
    const res = await apiClient.get('/')
    return res.data
}

/** 添加单个菜品 */
export const addDish = async (dish) => {
    const res = await apiClient.post('/', dish)
    return res.data
}

/** 批量添加菜品 */
export const batchAddDishes = async (payload) => {
    const res = await apiClient.post('/batch', payload)
    return res.data
}

/** 删除单个菜品 */
export const deleteDishById = async (id) => {
    const res = await apiClient.delete(`/${id}`)
    return res.data
}

/**
 * 批量删除菜品
 * @param {string[]} ids - 要删除的菜品 ID 数组
 */
export const batchDeleteDishes = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('请提供要删除的 ID 数组')
    }
    // axios.delete 需要把 body 放在 config.data
    const res = await apiClient.delete('/batch', {
        data: { ids }
    })
    return res.data
}

/** 生成菜单 */
export const generateMenu = async (days = 1) => {
    const res = await apiClient.get('/generate', {
        params: { days }
    })
    return res.data
}
