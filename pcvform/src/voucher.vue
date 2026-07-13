<template>
  <div class="page-wrap">
    <div class="vouchers-header">
      <div>
        <h1 class="serif vouchers-title">My Vouchers</h1>
        <p class="vouchers-sub">
          {{ myVouchers.length }} voucher{{ myVouchers.length !== 1 ? 's' : '' }} submitted by you
        </p>
      </div>
      <button class="btn btn-primary" @click="goToForm">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Voucher
      </button>
    </div>

    <div v-if="!myVouchers.length" class="vouchers-empty card">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <p class="vouchers-empty__title">No vouchers yet</p>
      <p class="vouchers-empty__sub">Vouchers you submit will appear here.</p>
      <button class="btn btn-primary" @click="goToForm">Create your first voucher</button>
    </div>

    <div v-else class="vouchers-table-wrap card">
      <table class="vouchers-table">
        <thead>
          <tr>
            <th>Voucher No.</th>
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
            v-for="voucher in [...myVouchers].reverse()"
            :key="voucher.id"
            class="vouchers-table__row"
          >
            <td>
              <code class="voucher-cell-no">{{ voucher.id }}</code>
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

    <div v-if="myVouchers.length" class="vouchers-summary">
      <div class="summary-card">
        <p class="mono-label">Total Vouchers</p>
        <p class="summary-value serif">{{ myVouchers.length }}</p>
      </div>
      <div class="summary-card">
        <p class="mono-label">Total Amount</p>
        <p class="summary-value serif">₦{{ myTotal.toFixed(2) }}</p>
      </div>
      <div class="summary-card">
        <p class="mono-label">Departments</p>
        <p class="summary-value serif">{{ myDepts }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { allVouchers, userEmail } from './stores/appState'

const router = useRouter()

function goToForm() {
  router.push({ name: 'form' })
}

const myVouchers = computed(() =>
  allVouchers.value.filter((voucher) => voucher.submittedBy === userEmail.value),
)
const myTotal = computed(() => myVouchers.value.reduce((sum, voucher) => sum + voucher.amount, 0))
const myDepts = computed(() => new Set(myVouchers.value.map((voucher) => voucher.department)).size)
</script>
