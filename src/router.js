// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DishManager from './views/DishManager.vue'
import MenuGenerator from './views/MenuGenerator.vue'

const routes = [
    { path: '/', redirect: '/dishes' },
    { path: '/dishes', component: DishManager },
    { path: '/menu', component: MenuGenerator }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
