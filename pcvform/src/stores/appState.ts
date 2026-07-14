import { computed, ref } from 'vue'

function loadVouchers() {
  try {
    return JSON.parse(localStorage.getItem('pcv_vouchers') || '[]')
  } catch {
    return []
  }
}

const userEmail = ref(sessionStorage.getItem('pcv_user') || '')
const userRole = ref(sessionStorage.getItem('pcv_role') || '')
const isLoggedIn = ref(Boolean(userEmail.value))
const isAdmin = computed(() => userRole.value === 'admin')
const allVouchers = ref(loadVouchers())

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

function addVoucher(entry: Record<string, unknown>) {
  allVouchers.value = [...allVouchers.value, entry]
  localStorage.setItem('pcv_vouchers', JSON.stringify(allVouchers.value))
}

type OnboardingUser = {
  id: string
  email: string
  department: string
  addedAt: string
}

function loadOnboardingUsers(): OnboardingUser[] {
  try {
    return JSON.parse(localStorage.getItem('pcv_onboarding_users') || '[]')
  } catch {
    return []
  }
}

const onboardingUsers = ref<OnboardingUser[]>(loadOnboardingUsers())

function addOnboardingUser(email: string, department: string) {
  const entry: OnboardingUser = {
    id: crypto.randomUUID(),
    email,
    department,
    addedAt: new Date().toISOString().slice(0, 10),
  }
  onboardingUsers.value = [...onboardingUsers.value, entry]
  localStorage.setItem('pcv_onboarding_users', JSON.stringify(onboardingUsers.value))
}

function removeOnboardingUser(id: string) {
  onboardingUsers.value = onboardingUsers.value.filter((user) => user.id !== id)
  localStorage.setItem('pcv_onboarding_users', JSON.stringify(onboardingUsers.value))
}

export {
  addOnboardingUser,
  addVoucher,
  allVouchers,
  isAdmin,
  isLoggedIn,
  loginUser,
  logoutUser,
  onboardingUsers,
  removeOnboardingUser,
  userEmail,
  userRole,
}
