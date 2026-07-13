<template>
  <div class="page-wrap">
    <div class="vouchers-header">
      <div>
        <h1 class="serif vouchers-title">Admin Panel</h1>
        <p class="vouchers-sub">All submitted vouchers across all users</p>
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
</template>

<script setup>
import { reactive, computed } from 'vue'
import { allVouchers } from './stores/appState'

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
</script>
