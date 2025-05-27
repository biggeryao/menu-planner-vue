import axios from 'axios'

const BASE = 'https://menu-planner-dc8j.onrender.com/api'

export const getDishes = async () => {
    const res = await axios.get(`${BASE}/dishes`)
    return res.data
}

export const addDish = async (dish) => {
    await axios.post(`${BASE}/dishes`, dish)
}

export const batchAddDishes = async (dish) => {
    await axios.post(`${BASE}/dishes/batch`, dish)
}

export const deleteDishById = async (id) => {
    await axios.delete(`${BASE}/dishes/${id}`)
}

export const generateMenu = async (days) => {
    const res = await axios.get(`${BASE}/generate?days=${days}`)
    return res.data
}
