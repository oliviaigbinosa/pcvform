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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
      <div class="admin-filters card">
        <div class="field admin-filter-field">
          <label class="mono-label">Filter by Department</label>
          <select v-model="adminFilter.dept">
            <option value="">All Departments</option>
            <option v-for="department in adminDepts" :key="department" :value="department">
              {{ department }}
            </option>
          </select>
        </div>
        <div class="field admin-filter-field">
          <label class="mono-label">Filter by Submitted By</label>
          <select v-model="adminFilter.user">
            <option value="">All Users</option>
            <option v-for="user in adminUsers" :key="user" :value="user">{{ user }}</option>
          </select>
        </div>
        <button
          class="btn btn-outline admin-filter-clear"
          @click="((adminFilter.dept = ''), (adminFilter.user = ''))"
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

      <div v-else class="vouchers-table-wrap card">
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
              <td class="text-muted">{{ voucher.date }}</td>
              <td class="font-medium">{{ voucher.payee }}</td>
              <td class="text-muted">{{ voucher.department }}</td>
              <td class="voucher-purpose">{{ voucher.purpose }}</td>
              <td class="text-right font-mono font-medium">₦{{ voucher.amount.toFixed(2) }}</td>
              <td class="text-center"><span class="status-badge">Sent</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredAdminVouchers.length" class="vouchers-summary">
        <div class="summary-card">
          <p class="mono-label">Total Vouchers</p>
          <p class="summary-value serif">{{ filteredAdminVouchers.length }}</p>
        </div>
        <div class="summary-card">
          <p class="mono-label">Total Amount</p>
          <p class="summary-value serif">₦{{ adminTotal.toFixed(2) }}</p>
        </div>
        <div class="summary-card">
          <p class="mono-label">Unique Users</p>
          <p class="summary-value serif">{{ adminUniqueUsers }}</p>
        </div>
      </div>
    </div>

    <!-- User Onboarding tab -->
    <div v-else role="tabpanel">
      <div class="onboarding-form card">
        <h2 class="onboarding-form__title serif">Invite New User</h2>
        <p class="onboarding-form__sub">Add a user to grant access to the voucher system.</p>
        <form class="onboarding-form__fields" @submit.prevent="handleAddUser">
          <div class="field onboarding-field">
            <label class="mono-label">Email Address <span class="req">*</span></label>
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
            <label class="mono-label">Department <span class="req">*</span></label>
            <input
              v-model="onboardForm.department"
              type="text"
              placeholder="e.g. Finance"
              :class="{ error: onboardErrors.department }"
              @input="delete onboardErrors.department"
            />
            <span v-if="onboardErrors.department" class="err-msg">{{
              onboardErrors.department
            }}</span>
          </div>
          <button type="submit" class="btn btn-primary onboarding-submit">
            Add User
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
        <table class="vouchers-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Department</th>
              <th>Added On</th>
              <th class="text-center">Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in onboardingUsers" :key="user.id" class="vouchers-table__row">
              <td>
                <div class="admin-user-cell">
                  <span class="admin-user-avatar">{{ user.email.charAt(0).toUpperCase() }}</span>
                  <span class="admin-user-email">{{ user.email }}</span>
                </div>
              </td>
              <td class="text-muted">{{ user.department }}</td>
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
              <td class="text-center">
                <button
                  v-if="!isUserActive(user.email)"
                  class="btn btn-outline onboarding-remove-btn"
                  @click="removeOnboardingUser(user.id)"
                >
                  Remove
                </button>
                <span v-else class="text-muted onboarding-active-label">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="onboardingUsers.length" class="vouchers-summary">
        <div class="summary-card">
          <p class="mono-label">Total Users</p>
          <p class="summary-value serif">{{ onboardingUsers.length }}</p>
        </div>
        <div class="summary-card">
          <p class="mono-label">Active</p>
          <p class="summary-value serif">{{ activeOnboardingCount }}</p>
        </div>
        <div class="summary-card">
          <p class="mono-label">Pending</p>
          <p class="summary-value serif">{{ pendingOnboardingCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import {
  allVouchers,
  onboardingUsers,
  addOnboardingUser,
  removeOnboardingUser,
} from './stores/appState'

const activeTab = ref('vouchers')

const adminFilter = reactive({ dept: '', user: '' })
const adminDepts = computed(() =>
  [...new Set(allVouchers.value.map((voucher) => voucher.department))].sort(),
)
const adminUsers = computed(() =>
  [...new Set(allVouchers.value.map((voucher) => voucher.submittedBy))].sort(),
)

const filteredAdminVouchers = computed(() => {
  return [...allVouchers.value]
    .reverse()
    .filter(
      (voucher) =>
        (!adminFilter.dept || voucher.department === adminFilter.dept) &&
        (!adminFilter.user || voucher.submittedBy === adminFilter.user),
    )
})

const adminTotal = computed(() =>
  filteredAdminVouchers.value.reduce((sum, voucher) => sum + voucher.amount, 0),
)
const adminUniqueUsers = computed(
  () => new Set(filteredAdminVouchers.value.map((voucher) => voucher.submittedBy)).size,
)

const activeVoucherEmails = computed(
  () => new Set(allVouchers.value.map((voucher) => voucher.submittedBy)),
)

function isUserActive(email) {
  return activeVoucherEmails.value.has(email)
}

const activeOnboardingCount = computed(
  () => onboardingUsers.value.filter((user) => isUserActive(user.email)).length,
)
const pendingOnboardingCount = computed(
  () => onboardingUsers.value.filter((user) => !isUserActive(user.email)).length,
)

const onboardForm = reactive({ email: '', department: '' })
const onboardErrors = reactive({})

function isOnboardEmail(v) {
  return /^[^\s@]+@getpayedmail\.com$/.test(v)
}

function handleAddUser() {
  delete onboardErrors.email
  delete onboardErrors.department

  if (!isOnboardEmail(onboardForm.email)) {
    onboardErrors.email = 'Email must be a @getpayedmail.com address'
  }
  if (!onboardForm.department.trim()) {
    onboardErrors.department = 'Department is required'
  }
  if (onboardingUsers.value.some((user) => user.email === onboardForm.email)) {
    onboardErrors.email = 'This user has already been added'
  }
  if (Object.keys(onboardErrors).length) return

  addOnboardingUser(onboardForm.email, onboardForm.department.trim())
  onboardForm.email = ''
  onboardForm.department = ''
}
</script>
