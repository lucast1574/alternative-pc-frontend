interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'seller' | 'admin'
  phone?: string
  dni?: string
  address?: string
  city?: string
  district?: string
  avatarUrl?: string
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

  function saveSession(t: string, u: User) {
    token.value = t
    user.value = u
    if (import.meta.client) {
      localStorage.setItem('token', t)
      localStorage.setItem('user', JSON.stringify(u))
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch<{ token: string; user: User }>(`${config.public.apiUrl}/api/auth/login`, {
      method: 'POST',
      body: { email, password }
    })
    saveSession(data.token, data.user)
    return data
  }

  async function register(form: {
    name: string; email: string; password: string;
    phone: string; dni: string; address: string; city: string; district?: string
  }) {
    const data = await $fetch<{ token: string; user: User }>(`${config.public.apiUrl}/api/auth/register`, {
      method: 'POST',
      body: form
    })
    saveSession(data.token, data.user)
    return data
  }

  async function googleAuth(accessToken: string) {
    const data = await $fetch<{ token: string; user: User; profileComplete: boolean }>(`${config.public.apiUrl}/api/auth/google`, {
      method: 'POST',
      body: { token: accessToken }
    })
    saveSession(data.token, data.user)
    return data
  }

  async function updateProfile(fields: Partial<User>) {
    const data = await $fetch<User>(`${config.public.apiUrl}/api/me`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: fields
    })
    user.value = data
    if (import.meta.client) {
      localStorage.setItem('user', JSON.stringify(data))
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
  const profileComplete = computed(() => !!(user.value?.dni && user.value?.phone && user.value?.address))

  function authHeaders(): Record<string, string> {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    user, token, login, register, googleAuth, updateProfile,
    logout, init, isLoggedIn, isAdmin, isSeller, profileComplete, authHeaders
  }
}
