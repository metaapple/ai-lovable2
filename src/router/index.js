import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Transactions from '../views/Transactions.vue'
import AddTransaction from '../views/AddTransaction.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login',    name: 'login',    component: Login,    meta: { guest: true } },
    { path: '/register', name: 'register', component: Register, meta: { guest: true } },
    { path: '/',         name: 'dashboard',    component: Dashboard,       meta: { requiresAuth: true } },
    { path: '/transactions', name: 'transactions', component: Transactions, meta: { requiresAuth: true } },
    { path: '/add',      name: 'add',      component: AddTransaction,  meta: { requiresAuth: true } }
  ]
})

// 네비게이션 가드
router.beforeEach((to, _from, next) => {
  const user = localStorage.getItem('auth_user')
  const isLoggedIn = !!user

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 로그인 필요 페이지 → 미로그인 시 로그인으로
    return next({ name: 'login' })
  }
  if (to.meta.guest && isLoggedIn) {
    // 로그인/회원가입 페이지 → 이미 로그인 시 대시보드로
    return next({ name: 'dashboard' })
  }
  next()
})

export default router
