import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from './api'

export const useAuthStore = defineStore('auth', () => {
  // localStorage에서 초기 상태 복원
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const token = ref(localStorage.getItem('auth_token') || null)

  const isLoggedIn = computed(() => !!user.value)

  // 로그인
  const login = async (email, password) => {
    const { data } = await api.get('/users', { params: { email } })
    if (data.length === 0) {
      throw new Error('이메일이 존재하지 않습니다.')
    }
    const found = data[0]
    if (found.password !== password) {
      throw new Error('비밀번호가 올바르지 않습니다.')
    }
    // 비밀번호 제외한 유저 정보 저장
    const { password: _pw, ...safeUser } = found
    user.value = safeUser
    token.value = `mock-token-${safeUser.id}-${Date.now()}`
    localStorage.setItem('auth_user', JSON.stringify(safeUser))
    localStorage.setItem('auth_token', token.value)
    return safeUser
  }

  // 회원가입
  const register = async ({ name, email, password }) => {
    // 중복 이메일 확인
    const { data: existing } = await api.get('/users', { params: { email } })
    if (existing.length > 0) {
      throw new Error('이미 사용 중인 이메일입니다.')
    }
    const payload = {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    }
    const { data: newUser } = await api.post('/users', payload)
    const { password: _pw, ...safeUser } = newUser
    user.value = safeUser
    token.value = `mock-token-${safeUser.id}-${Date.now()}`
    localStorage.setItem('auth_user', JSON.stringify(safeUser))
    localStorage.setItem('auth_token', token.value)
    return safeUser
  }

  // 로그아웃
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  return { user, token, isLoggedIn, login, register, logout }
})
