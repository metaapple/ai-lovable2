<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  if (!email.value || !password.value) {
    errorMsg.value = '이메일과 비밀번호를 모두 입력해주세요.'
    return
  }
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <!-- 로고 -->
      <div class="auth-logo">
        <div class="auth-logo-icon">
          <i class="fa-solid fa-wallet"></i>
        </div>
        <h1 class="auth-brand">MoneyBook</h1>
        <p class="auth-brand-sub">Smart Ledger</p>
      </div>

      <h2 class="auth-title">로그인</h2>
      <p class="auth-desc">계정에 로그인하여 가계부를 관리하세요.</p>

      <form @submit.prevent="handleLogin" novalidate>
        <!-- 이메일 -->
        <div class="mb-3">
          <label class="form-label">이메일</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
            <input
              v-model="email"
              type="email"
              class="form-control"
              placeholder="example@email.com"
              autocomplete="email"
            />
          </div>
        </div>

        <!-- 비밀번호 -->
        <div class="mb-3">
          <label class="form-label">비밀번호</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="비밀번호 입력"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="input-group-text btn-eye"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="errorMsg" class="alert alert-danger py-2 mb-3">
          <i class="fa-solid fa-circle-exclamation me-1"></i>{{ errorMsg }}
        </div>

        <!-- 로그인 버튼 -->
        <button type="submit" class="btn btn-primary w-100 auth-btn" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="fa-solid fa-right-to-bracket me-2"></i>
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <!-- 회원가입 링크 -->
      <div class="auth-footer">
        <span>계정이 없으신가요?</span>
        <RouterLink to="/register" class="auth-link">회원가입</RouterLink>
      </div>

      <!-- 테스트 계정 안내 -->
      <div class="demo-box">
        <p class="demo-title"><i class="fa-solid fa-circle-info me-1"></i>테스트 계정</p>
        <p class="demo-info">이메일: admin@moneybook.com</p>
        <p class="demo-info">비밀번호: admin1234</p>
      </div>
    </div>
  </div>
</template>
