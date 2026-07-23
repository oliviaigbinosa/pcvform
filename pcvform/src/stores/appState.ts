import { computed, ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const userEmail = ref(sessionStorage.getItem('pcv_user') || '')
const userRole = ref(sessionStorage.getItem('pcv_role') || '')
const isLoggedIn = ref(Boolean(userEmail.value))
const isAdmin = computed(() => userRole.value === 'admin' || userRole.value === 'super admin')
const allVouchers = ref<any[]>([])
const loadingVouchers = ref(true)

function loginUser(email: string, role = 'user') {
  userEmail.value = email
  userRole.value = role
  isLoggedIn.value = true

  sessionStorage.setItem('pcv_user', email)
  sessionStorage.setItem('pcv_role', role)
}

function logoutUser() {
  userEmail.value = ''
  userRole.value = ''
  isLoggedIn.value = false

  sessionStorage.removeItem('pcv_user')
  sessionStorage.removeItem('pcv_role')
}

async function fetchVouchers() {
  loadingVouchers.value = true
  try {
    const res = await fetch(`${API_BASE}/api/vouchers`)
    if (!res.ok) {
      throw new Error('Failed to fetch vouchers')
    }
    allVouchers.value = await res.json()
  } finally {
    loadingVouchers.value = false
  }
}

async function addVoucher(entry: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/vouchers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save voucher')
  }
  allVouchers.value = [data, ...allVouchers.value]
}

async function updateVoucherStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/api/vouchers/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update voucher status')
  }
  const index = allVouchers.value.findIndex((v) => v.id === id)
  if (index !== -1) {
    allVouchers.value[index] = data
  }
}

type OnboardingUser = {
  id: string
  email: string
  addedAt: string
}

const onboardingUsers = ref<OnboardingUser[]>([])

async function fetchOnboardingUsers() {
  const res = await fetch(`${API_BASE}/api/admin/users`)
  if (!res.ok) {
    throw new Error('Failed to load users')
  }
  onboardingUsers.value = await res.json()
}

async function addOnboardingUser(email: string, password: string, createdBy?: string, department?: string, role?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (createdBy) {
    headers['x-admin-email'] = createdBy
  }
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password, createdBy, department, role }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to add user')
  }
  onboardingUsers.value = [data, ...onboardingUsers.value]
}

async function removeOnboardingUser(id: string) {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to remove user')
  }
  onboardingUsers.value = onboardingUsers.value.filter((user) => user.id !== id)
}

async function changePassword(email: string, currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/api/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, currentPassword, newPassword }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update password')
  }
}

async function sendInviteEmail(email: string, password: string, from?: string) {
  const res = await fetch(`${API_BASE}/api/email/send-invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: email, password, from }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send invite email')
  }
}

export {
  addOnboardingUser,
  API_BASE,
  addVoucher,
  allVouchers,
  changePassword,
  fetchOnboardingUsers,
  fetchVouchers,
  isAdmin,
  loadingVouchers,
  isLoggedIn,
  loginUser,
  logoutUser,
  onboardingUsers,
  removeOnboardingUser,
  sendInviteEmail,
  updateVoucherStatus,
  userEmail,
  userRole,
}
