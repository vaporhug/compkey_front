import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Analysis from '../views/Analysis.vue'
//import MarketingCopy from '../views/MarketingCopy.vue'
//import Chat from '../views/Chat.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/analysis', component: Analysis }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
