<template>
  <div class="page-wrap">
    <div class="vouchers-header">
      <div>
        <h1 class="serif vouchers-title">Dashboard</h1>
        <p class="vouchers-sub">
          {{
            activeTab === 'vouchers'
              ? 'All submitted vouchers across all users'
              : 'Manage user access and onboarding'
          }}
        </p>
      </div>
      <div class="admin-header-actions">
        <span class="admin-badge mono-label">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Admin View
        </span>
      </div>
    </div>

    <nav class="dashboard-tabs" role="tablist" aria-label="Dashboard sections">
      <button
        role="tab"
        class="dashboard-tabs__tab"
        :class="{ active: activeTab === 'vouchers' }"
        :aria-selected="activeTab === 'vouchers'"
        @click="activeTab = 'vouchers'"
      >
        All vouchers
        <span v-if="allVouchers.length" class="dashboard-tabs__badge">{{
          allVouchers.length
        }}</span>
      </button>
      <button
        role="tab"
        class="dashboard-tabs__tab"
        :class="{ active: activeTab === 'onboarding' }"
        :aria-selected="activeTab === 'onboarding'"
        @click="activeTab = 'onboarding'"
      >
        User Onboarding
        <span v-if="pendingOnboardingCount" class="dashboard-tabs__badge">{{
          pendingOnboardingCount
        }}</span>
      </button>
    </nav>

    <!-- All vouchers tab -->
    <div v-if="activeTab === 'vouchers'" role="tabpanel">
      <!-- Voucher detail view -->
      <div v-if="selectedVoucher" class="voucher-detail">
        <button class="btn btn-outline voucher-detail__back" @click="selectedVoucher = null">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <div class="card">
          <div class="preview-head">
            <div>
              <p class="company-label">Getpayed Technology Solutions Ltd.</p>
              <h2 class="preview-title serif">Petty Cash Voucher</h2>
            </div>
            <div class="preview-head__right">
              <p class="mono-label tiny">Voucher No.</p>
              <code class="voucher-no">{{ selectedVoucher.id }}</code>
            </div>
          </div>

          <div class="preview-section">
            <h3 class="preview-section__title mono-label">Email Details</h3>
            <div class="preview-rows">
              <div class="preview-row">
                <span>From</span><span>{{ selectedVoucher.from || '—' }}</span>
              </div>
              <div class="preview-row">
                <span>To</span><span>{{ selectedVoucher.to || '—' }}</span>
              </div>
              <div class="preview-row">
                <span>CC</span><span>{{ selectedVoucher.cc || '—' }}</span>
              </div>
              <div class="preview-row">
                <span>Subject</span><span>{{ selectedVoucher.subject || '—' }}</span>
              </div>
            </div>
          </div>

          <div class="preview-section">
            <h3 class="preview-section__title mono-label">Payee Information</h3>
            <div class="preview-rows">
              <div class="preview-row">
                <span>Payee</span><span>{{ selectedVoucher.payee || '—' }}</span>
              </div>
              <div class="preview-row">
                <span>Department</span><span>{{ selectedVoucher.department || '—' }}</span>
              </div>
            </div>
          </div>

          <div class="preview-section">
            <h3 class="preview-section__title mono-label">Amount &amp; Purpose</h3>
            <div class="preview-rows">
              <div class="preview-row">
                <span>Amount (Figures)</span>
                <span class="mono-input">₦{{ selectedVoucher.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00' }}</span>
              </div>
              <div class="preview-row">
                <span>Amount (Words)</span><span>{{ selectedVoucher.amountWords || '—' }}</span>
              </div>
              <div class="preview-row block-row">
                <span>Purpose</span><span>{{ selectedVoucher.purpose || '—' }}</span>
              </div>
            </div>
          </div>

          <div class="preview-section">
            <h3 class="preview-section__title mono-label">Supporting Documents</h3>
            <div class="preview-rows">
              <div class="preview-row">
                <span>Submission Date</span><span>{{ selectedVoucher.submissionDate || '—' }}</span>
              </div>
              <div class="preview-row">
                <span>Attached Files</span>
                <span>
                  <template v-if="selectedVoucher.supportingDocs?.length">
                    <span v-for="(doc, i) in selectedVoucher.supportingDocs" :key="i">
                      <a
                        v-if="typeof doc === 'object' && doc?.data"
                        class="file-link"
                        href="#"
                        @click.prevent="openFilePreview(doc)"
                      >{{ doc.name }}</a>
                      <span v-else>{{ typeof doc === 'string' ? doc : doc?.name || '—' }}</span>
                      {{ i < selectedVoucher.supportingDocs.length - 1 ? ', ' : '' }}
                    </span>
                  </template>
                  <template v-else>None</template>
                </span>
              </div>
            </div>
          </div>

          <div class="amount-banner">
            <span class="mono-label">Total Amount</span>
            <span class="amount-total serif">₦{{ selectedVoucher.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00' }}</span>
          </div>
        </div>
      </div>

      <template v-else>
        <div class="admin-filters card">
          <div ref="deptDropdownRef" class="field admin-filter-field custom-select">
            <label class="mono-label">Filter by Department</label>
            <button
              type="button"
              class="custom-select__trigger"
              @click.stop="deptDropdownOpen = !deptDropdownOpen"
            >
              <span class="custom-select__label">{{
                adminFilter.dept || 'All Departments'
              }}</span>
              <svg
                class="custom-select__chevron"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div v-if="deptDropdownOpen" class="custom-select__options">
              <button
                type="button"
                class="custom-select__option"
                :class="{ selected: adminFilter.dept === '' }"
                @click="selectDept('')"
              >
                All Departments
              </button>
              <button
                v-for="department in adminDepts"
                :key="department"
                type="button"
                class="custom-select__option"
                :class="{ selected: adminFilter.dept === department }"
                @click="selectDept(department)"
              >
                {{ department }}
              </button>
            </div>
          </div>
          <div ref="userDropdownRef" class="field admin-filter-field custom-select">
            <label class="mono-label">Filter by Submitted By</label>
            <button
              type="button"
              class="custom-select__trigger"
              @click.stop="userDropdownOpen = !userDropdownOpen"
            >
              <span class="custom-select__label">{{
                adminFilter.user || 'All Users'
              }}</span>
              <svg
                class="custom-select__chevron"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div v-if="userDropdownOpen" class="custom-select__options">
              <button
                type="button"
                class="custom-select__option"
                :class="{ selected: adminFilter.user === '' }"
                @click="selectUser('')"
              >
                All Users
              </button>
              <button
                v-for="user in adminUsers"
                :key="user"
                type="button"
                class="custom-select__option"
                :class="{ selected: adminFilter.user === user }"
                @click="selectUser(user)"
              >
                {{ user }}
              </button>
            </div>
          </div>
          <div ref="statusDropdownRef" class="field admin-filter-field custom-select">
            <label class="mono-label">Filter by Status</label>
            <button
              type="button"
              class="custom-select__trigger"
              @click.stop="statusDropdownOpen = !statusDropdownOpen"
            >
              <span class="custom-select__label">{{ formatStatus(adminFilter.status) }}</span>
              <svg
                class="custom-select__chevron"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div v-if="statusDropdownOpen" class="custom-select__options">
              <button
                type="button"
                class="custom-select__option"
                :class="{ selected: adminFilter.status === '' }"
                @click="selectStatus('')"
              >
                All Statuses
              </button>
              <button
                v-for="status in adminStatuses"
                :key="status"
                type="button"
                class="custom-select__option"
                :class="{ selected: adminFilter.status === status }"
                @click="selectStatus(status)"
              >
                {{ formatStatus(status) }}
              </button>
            </div>
          </div>
          <button
            class="btn btn-outline admin-filter-clear"
            @click="((adminFilter.dept = ''), (adminFilter.user = ''), (adminFilter.status = ''))"
          >
            Clear Filters
          </button>
        </div>

        <div v-if="!filteredAdminVouchers.length" class="vouchers-empty card">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p class="vouchers-empty__title">No vouchers found</p>
          <p class="vouchers-empty__sub">No vouchers match the selected filters.</p>
        </div>

        <div v-else class="vouchers-table-wrap card admin-all-vouchers">
          <table class="vouchers-table">
            <thead>
              <tr>
                <th>Voucher No.</th>
                <th>Submitted By</th>
                <th>Date</th>
                <th>Payee</th>
                <th>Department</th>
                <th>Purpose</th>
                <th class="text-right">Amount</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="voucher in filteredAdminVouchers"
                :key="voucher.id + voucher.submittedBy"
                class="vouchers-table__row"
                @click="selectedVoucher = voucher"
              >
                <td>
                  <code class="voucher-cell-no">{{ voucher.id }}</code>
                </td>
                <td>
                  <div class="admin-user-cell">
                    <span class="admin-user-avatar">{{
                      voucher.submittedBy.charAt(0).toUpperCase()
                    }}</span>
                    <span class="admin-user-email">{{ voucher.submittedBy }}</span>
                  </div>
                </td>
                <td class="text-muted">{{ voucher.submissionDate }}</td>
                <td class="font-medium">{{ voucher.payee }}</td>
                <td class="text-muted">{{ voucher.department }}</td>
                <td><span class="voucher-purpose" :class="{ expanded: expandedPurposes[voucher.id] }" @click.stop="togglePurpose(voucher.id)">{{ voucher.purpose }}</span></td>
                <td class="text-right font-mono font-medium">₦{{ voucher.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                <td class="text-center"><span class="status-badge" :class="'status-badge--' + (voucher.status?.toLowerCase() || 'pending')">{{ voucher.status || 'Pending' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

     
      </template>
    </div>

    <!-- User Onboarding tab -->
    <div v-else role="tabpanel">
      <div class="onboarding-form card">
        <h2 class="onboarding-form__title serif">Onboard New User</h2>
        <p class="onboarding-form__sub">Add a user to grant access to the voucher system.</p>
        <form class="onboarding-form__fields" @submit.prevent="handleAddUser">
          <div class="field onboarding-field">
            <label class="mono-label">Email Address </label>
            <input
              v-model="onboardForm.email"
              type="email"
              placeholder="user@getpayedmail.com"
              :class="{ error: onboardErrors.email }"
              @input="delete onboardErrors.email"
            />
            <span v-if="onboardErrors.email" class="err-msg">{{ onboardErrors.email }}</span>
          </div>
          <div class="field onboarding-field">
            <label class="mono-label">Password </label>
            <button
              v-if="!generatedPassword"
              type="button"
              class="btn btn-generate-password"
              @click="generatePassword"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Generate Password
            </button>
            <input
              v-else
              :value="generatedPassword"
              type="text"
              readonly
              class="password-display"
            />
            <span v-if="onboardErrors.password" class="err-msg">{{ onboardErrors.password }}</span>
          </div>
          <span v-if="onboardErrors.general" class="err-msg">{{ onboardErrors.general }}</span>
          <button type="submit" class="btn btn-primary onboarding-submit" :disabled="addingUser">
            {{ addingUser ? 'Adding…' : 'Add User' }}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </button>
        </form>
      </div>

      <div v-if="!onboardingUsers.length" class="vouchers-empty card">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        <p class="vouchers-empty__title">No users onboarded yet</p>
        <p class="vouchers-empty__sub">Add users above to grant them access to the system.</p>
      </div>

      <div v-else class="vouchers-table-wrap card">
        <table class="vouchers-table onboarding-table">
          <thead>
            <tr>
              <th class="text-center">S/N</th>
              <th>User</th>
              <th>Added On</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in onboardingUsers" :key="user.id" class="vouchers-table__row">
              <td class="text-center text-muted">{{ index + 1 }}</td>
              <td>
                <div class="admin-user-cell">
                  <span class="admin-user-avatar">{{ user.email.charAt(0).toUpperCase() }}</span>
                  <span class="admin-user-email">{{ user.email }}</span>
                </div>
              </td>
              <td class="text-muted">{{ user.addedAt }}</td>
              <td class="text-center">
                <span
                  class="status-badge"
                  :class="
                    isUserActive(user.email) ? 'status-badge--active' : 'status-badge--pending'
                  "
                >
                  {{ isUserActive(user.email) ? 'Active' : 'Pending' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
    </div>
  </div>
  <FilePreview :show="showFilePreview" :file="previewFile" @close="showFilePreview = false" />
</template>

<script setup>
import { reactive, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import FilePreview from './FilePreview.vue'
import {
  allVouchers,
  onboardingUsers,
  addOnboardingUser,
  removeOnboardingUser,
  fetchOnboardingUsers,
  userEmail,
  sendInviteEmail,
} from './stores/appState'

const activeTab = ref('vouchers')
const selectedVoucher = ref(null)
const addingUser = ref(false)
const removingUserId = ref('')
const loadingUsers = ref(false)
const generatedPassword = ref('')
const showFilePreview = ref(false)
const previewFile = ref(null)
const deptDropdownOpen = ref(false)
const userDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)
const deptDropdownRef = ref(null)
const userDropdownRef = ref(null)
const statusDropdownRef = ref(null)

const expandedPurposes = reactive({})

function togglePurpose(id) {
  expandedPurposes[id] = !expandedPurposes[id]
}

const onboardForm = reactive({ email: '', password: '' })
const onboardErrors = reactive({})

onMounted(async () => {
  loadingUsers.value = true
  try {
    await fetchOnboardingUsers()
  } catch {
    onboardErrors.general = 'Could not load users. Make sure the backend is running.'
  } finally {
    loadingUsers.value = false
  }
  window.addEventListener('click', closeDropdowns)
})

const adminFilter = reactive({ dept: '', user: '', status: '' })
const adminDepts = computed(() =>
  [...new Set(allVouchers.value.map((voucher) => voucher.department))].sort(),
)
const adminUsers = computed(() =>
  [...new Set(allVouchers.value.map((voucher) => voucher.submittedBy))].sort(),
)
const adminStatuses = computed(() =>
  [...new Set(allVouchers.value.map((voucher) => (voucher.status || 'Pending').toLowerCase()))].sort(),
)

function openFilePreview(doc) {
  previewFile.value = doc
  showFilePreview.value = true
}

function formatStatus(status) {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All Statuses'
}

function selectDept(dept) {
  adminFilter.dept = dept
  deptDropdownOpen.value = false
}

function selectUser(user) {
  adminFilter.user = user
  userDropdownOpen.value = false
}

function selectStatus(status) {
  adminFilter.status = status
  statusDropdownOpen.value = false
}

function closeDropdowns(event) {
  if (deptDropdownRef.value && !deptDropdownRef.value.contains(event.target)) {
    deptDropdownOpen.value = false
  }
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target)) {
    userDropdownOpen.value = false
  }
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(event.target)) {
    statusDropdownOpen.value = false
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdowns)
})

const filteredAdminVouchers = computed(() => {
  return [...allVouchers.value]
    .reverse()
    .filter(
      (voucher) =>
        (!adminFilter.dept || voucher.department === adminFilter.dept) &&
        (!adminFilter.user || voucher.submittedBy === adminFilter.user) &&
        (!adminFilter.status ||
          (voucher.status || 'Pending').toLowerCase() === adminFilter.status),
    )
})


const activeVoucherEmails = computed(
  () => new Set(allVouchers.value.map((voucher) => voucher.submittedBy)),
)

function isUserActive(email) {
  return activeVoucherEmails.value.has(email)
}

const pendingOnboardingCount = computed(
  () => onboardingUsers.value.filter((user) => !isUserActive(user.email)).length,
)

function isOnboardEmail(v) {
  return /^[^\s@]+@(getpayedmail\.com|gmail\.com)$/.test(v)
}

function generateStrongPassword() {
  const length = 8
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length]
  }
  return password
}

function generatePassword() {
  generatedPassword.value = generateStrongPassword()
}

async function handleAddUser() {
  delete onboardErrors.email
  delete onboardErrors.password
  delete onboardErrors.general

  if (!isOnboardEmail(onboardForm.email)) {
    onboardErrors.email = 'Email must be a @getpayedmail.com or @gmail.com address'
  }
  if (!generatedPassword.value) {
    onboardErrors.password = 'Please generate a password first'
  }
  if (Object.keys(onboardErrors).length) return

  addingUser.value = true
  try {
    await sendInviteEmail(onboardForm.email, generatedPassword.value, userEmail.value)
    await addOnboardingUser(onboardForm.email, generatedPassword.value, userEmail.value)
    onboardForm.email = ''
    generatedPassword.value = ''
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add user'
    if (message.includes('already been added')) {
      onboardErrors.email = message
    } else {
      onboardErrors.general = message
    }
  } finally {
    addingUser.value = false
  }
}

async function handleRemoveUser(id) {
  removingUserId.value = id
  try {
    await removeOnboardingUser(id)
  } catch (error) {
    onboardErrors.general = error instanceof Error ? error.message : 'Failed to remove user'
  } finally {
    removingUserId.value = ''
  }
}
</script>

<style scoped>
.admin-all-vouchers .vouchers-table th,
.admin-all-vouchers .vouchers-table td {
  white-space: normal;
  overflow-wrap: break-word;
  padding: 8px 10px;
}

.admin-all-vouchers .admin-user-email,
.admin-all-vouchers .voucher-purpose {
  white-space: normal;
  overflow-wrap: break-word;
}

.admin-all-vouchers .admin-user-email {
  max-width: 120px;
}

.admin-all-vouchers .voucher-purpose {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  white-space: normal;
  cursor: pointer;
  color: #000;
}

.admin-all-vouchers .voucher-purpose.expanded {
  -webkit-line-clamp: unset;
  line-clamp: unset;
  display: block;
}

.admin-all-vouchers .vouchers-table th:nth-child(3),
.admin-all-vouchers .vouchers-table td:nth-child(3) {
  text-align: center;
}
</style>
