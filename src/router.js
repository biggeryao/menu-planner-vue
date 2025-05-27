// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DishManager from './views/DishManager.vue'
import MenuGenerator from './views/MenuGenerator.vue'
const routes = [
    { path: '/',      name: 'Home',   component: DishManager },
    { path: '/dishes',name: 'Dishes', component: DishManager },
    { path: '/menu',  name: 'Menu',   component: MenuGenerator },
    // 捕获所有其它路由，重定向到首页或 404 组件
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
