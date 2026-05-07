<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const errorMsg = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const handleRegister = async () => {
  errorMsg.value = ''

  if (!name.value || !email.value || !password.value || !passwordConfirm.value) {
    errorMsg.value = '모든 항목을 입력해주세요.'
    return
  }
  if (name.value.trim().length < 2) {
    errorMsg.value = '이름은 2자 이상 입력해주세요.'
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMsg.value = '올바른 이메일 형식을 입력해주세요.'
    return
  }
  if (password.value.length < 6) {
    errorMsg.value = '비밀번호는 6자 이상 입력해주세요.'
    return
  }
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  loading.value = true
  try {
    await auth.register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value
    })
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

      <h2 class="auth-title">회원가입</h2>
      <p class="auth-desc">새 계정을 만들고 스마트 가계부를 시작하세요.</p>

      <form @submit.prevent="handleRegister" novalidate>
        <!-- 이름 -->
        <div class="mb-3">
          <label class="form-label">이름</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
            <input
              v-model="name"
              type="text"
              class="form-control"
              placeholder="홍길동"
              autocomplete="name"
            />
          </div>
        </div>

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
          <label class="form-label">비밀번호 <span class="text-muted fw-normal" style="font-size:.8rem">(6자 이상)</span></label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="비밀번호 입력"
              autocomplete="new-password"
            />
            <button type="button" class="input-group-text btn-eye" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="mb-3">
          <label class="form-label">비밀번호 확인</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-shield-halved"></i></span>
            <input
              v-model="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              class="form-control"
              :class="{
                'is-valid': passwordConfirm && password === passwordConfirm,
                'is-invalid': passwordConfirm && password !== passwordConfirm
              }"
              placeholder="비밀번호 재입력"
              autocomplete="new-password"
            />
            <button type="button" class="input-group-text btn-eye" @click="showPasswordConfirm = !showPasswordConfirm">
              <i :class="showPasswordConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>
          <div v-if="passwordConfirm && password !== passwordConfirm" class="invalid-feedback d-block">
            비밀번호가 일치하지 않습니다.
          </div>
          <div v-if="passwordConfirm && password === passwordConfirm" class="valid-feedback d-block">
            비밀번호가 일치합니다.
          </div>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="errorMsg" class="alert alert-danger py-2 mb-3">
          <i class="fa-solid fa-circle-exclamation me-1"></i>{{ errorMsg }}
        </div>

        <!-- 회원가입 버튼 -->
        <button type="submit" class="btn btn-primary w-100 auth-btn" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="fa-solid fa-user-plus me-2"></i>
          {{ loading ? '가입 중...' : '회원가입' }}
        </button>
      </form>

      <!-- 로그인 링크 -->
      <div class="auth-footer">
        <span>이미 계정이 있으신가요?</span>
        <RouterLink to="/login" class="auth-link">로그인</RouterLink>
      </div>
    </div>
  </div>
</template>
