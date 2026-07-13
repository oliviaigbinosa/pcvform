import { ref } from 'vue'

function loadVouchers() {
  try {
    return JSON.parse(localStorage.getItem('pcv_vouchers') || '[]')
  } catch {
    return []
  }
}

const userEmail = ref(sessionStorage.getItem('pcv_user') || '')
const isLoggedIn = ref(Boolean(userEmail.value))
const allVouchers = ref(loadVouchers())

function loginUser(email: string, _role = 'user', _token = '') {
  userEmail.value = email
  isLoggedIn.value = true

  sessionStorage.setItem('pcv_user', email)
}

function logoutUser() {
  userEmail.value = ''
  isLoggedIn.value = false

  sessionStorage.removeItem('pcv_user')
}

function addVoucher(entry: Record<string, unknown>) {
  allVouchers.value = [...allVouchers.value, entry]
  localStorage.setItem('pcv_vouchers', JSON.stringify(allVouchers.value))
}

export { addVoucher, allVouchers, isLoggedIn, loginUser, logoutUser, userEmail }
