interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'seller' | 'admin'
  phone?: string
}

const user = ref<User | null>(null)
const token = ref<string | null>(null)

export function useAuth() {
  const config = useRuntimeConfig()

  function init() {
    if (import.meta.client) {
      token.value = localStorage.getItem('token')
      const stored = localStorage.getItem('user')
      if (stored) user.value = JSON.parse(stored)
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch<{ token: string; user: User }>(`${config.public.apiUrl}/api/auth/login`, {
      method: 'POST',
      body: { email, password }
    })
    token.value = data.token
    user.value = data.user
    if (import.meta.client) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  }

  async function register(name: string, email: string, password: string, phone?: string) {
    const data = await $fetch<{ token: string; user: User }>(`${config.public.apiUrl}/api/auth/register`, {
      method: 'POST',
      body: { name, email, password, phone }
    })
    token.value = data.token
    user.value = data.user
    if (import.meta.client) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  }

  function logout() {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSeller = computed(() => user.value?.role === 'seller' || user.value?.role === 'admin')

  function authHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return { user, token, login, register, logout, init, isLoggedIn, isAdmin, isSeller, authHeaders }
}
