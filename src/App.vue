<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <!-- 로그인/회원가입 페이지는 사이드바 없이 전체화면 -->
  <RouterView v-if="!auth.isLoggedIn" />

  <!-- 로그인 된 경우 사이드바 + 메인 레이아웃 -->
  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <i class="fa-solid fa-wallet brand-icon"></i>
        <div>
          <div class="brand-title">MoneyBook</div>
          <div class="brand-sub">Smart Ledger</div>
        </div>
      </div>

      <nav class="nav flex-column gap-1">
        <RouterLink to="/" class="nav-link" active-class="active" exact-active-class="active">
          <i class="fa-solid fa-chart-pie"></i> 대시보드
        </RouterLink>
        <RouterLink to="/transactions" class="nav-link" active-class="active">
          <i class="fa-solid fa-list-ul"></i> 거래 내역
        </RouterLink>
        <RouterLink to="/add" class="nav-link" active-class="active">
          <i class="fa-solid fa-plus-circle"></i> 거래 추가
        </RouterLink>
      </nav>

      <!-- 사용자 정보 + 로그아웃 -->
      <div class="sidebar-user">
        <div class="user-avatar">
          {{ auth.user?.name?.charAt(0) ?? '?' }}
        </div>
        <div class="user-info">
          <div class="user-name">{{ auth.user?.name }}</div>
          <div class="user-email">{{ auth.user?.email }}</div>
        </div>
        <button class="logout-btn" @click="handleLogout" title="로그아웃">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>

      <div class="sidebar-footer">
        <i class="fa-solid fa-circle-info"></i> Vue 3 · Pinia · Bootstrap 5
      </div>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
