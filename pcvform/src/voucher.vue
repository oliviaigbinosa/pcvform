<template>
  <div class="page-wrap">
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

      <template v-if="activeTab === 'received'">
        <div v-if="selectedVoucher.status === 'Approved'" class="approve-message card success">
          This voucher form has been approved
        </div>
        <div v-else-if="selectedVoucher.status === 'Declined'" class="approve-message card declined">
          This voucher form has been declined
        </div>
        <div v-else class="approve-actions-bar">
          <button class="btn btn-approve" :disabled="processing" @click="showApproveModal = true">
            {{ processing && processingAction === 'approve' ? 'Approving…' : 'Approve' }}
          </button>
          <button class="btn btn-decline" @click="showDeclineModal = true">Decline</button>
        </div>
      </template>

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
      <div class="vouchers-header">
        <div>
          <h1 class="serif vouchers-title">My Vouchers</h1>
          <p class="vouchers-sub">
            {{ displayedVouchers.length }} voucher{{ displayedVouchers.length !== 1 ? 's' : '' }} {{ activeTab === 'sent' ? 'sent by you' : 'sent to you' }}
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

      <nav class="dashboard-tabs" role="tablist" aria-label="My voucher tabs">
        <button
          role="tab"
          class="dashboard-tabs__tab"
          :class="{ active: activeTab === 'sent' }"
          :aria-selected="activeTab === 'sent'"
          @click="activeTab = 'sent'"
        >
          Sent
          <span v-if="sentVouchers.length" class="dashboard-tabs__badge">{{ sentVouchers.length }}</span>
        </button>
        <button
          role="tab"
          class="dashboard-tabs__tab"
          :class="{ active: activeTab === 'received' }"
          :aria-selected="activeTab === 'received'"
          @click="activeTab = 'received'"
        >
          Received
          <span v-if="receivedVouchers.length" class="dashboard-tabs__badge">{{ receivedVouchers.length }}</span>
        </button>
      </nav>

      <div v-if="loadingVouchers" class="vouchers-loading">
        Loading vouchers…
      </div>

      <div v-else-if="!displayedVouchers.length" class="vouchers-empty card">
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
        <p class="vouchers-empty__title">No {{ activeTab === 'sent' ? 'sent' : 'received' }} vouchers</p>
        <p class="vouchers-empty__sub">
          {{ activeTab === 'sent' ? 'Vouchers you submit will appear here.' : 'Vouchers sent to you will appear here.' }}
        </p>
        <button v-if="activeTab === 'sent'" class="btn btn-primary" @click="goToForm">Create your first voucher</button>
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
              v-for="voucher in [...displayedVouchers].reverse()"
              :key="voucher.id"
              class="vouchers-table__row"
              @click="openVoucher(voucher)"
            >
              <td>
                <code class="voucher-cell-no">{{ voucher.id }}</code>
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
    <div v-if="showDeclineModal" class="modal-backdrop" @click.self="showDeclineModal = false">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Decline confirmation" style="max-width: 640px;">
        <div class="modal-header" style="padding: 8px 24px 4px;">
          <div class="modal-header__title" style="font-size: 16px; font-weight: 700; letter-spacing: -0.04em;">Decline voucher?</div>
          <button class="modal-close" @click="showDeclineModal = false" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 18px; font-weight: 900; letter-spacing: -0.04em; margin: 0;">Are you sure you want to decline this petty cash voucher?<span style="display: block; margin-top: 12px; font-size: 14px; color: var(--muted-fg); font-weight: 500;">This action cannot be undone.</span></p>
        </div>
        <div class="modal-footer" style="border-top: none;">
          <button class="btn btn-outline" style="border-radius: 9999px;" @click="showDeclineModal = false">Cancel</button>
          <button class="btn btn-decline" :disabled="processing" style="border-radius: 9999px;" @click="confirmDecline">
            {{ processing && processingAction === 'decline' ? 'Declining…' : 'Yes, Decline' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showApproveModal" class="modal-backdrop" @click.self="showApproveModal = false">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Approve confirmation" style="max-width: 640px;">
        <div class="modal-header" style="padding: 8px 24px 4px;">
          <div class="modal-header__title" style="font-size: 16px; font-weight: 700; letter-spacing: -0.04em;">Approve voucher?</div>
          <button class="modal-close" @click="showApproveModal = false" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 18px; font-weight: 900; letter-spacing: -0.04em; margin: 0;">Are you sure you want to approve this petty cash voucher?<span style="display: block; margin-top: 12px; font-size: 14px; color: var(--muted-fg); font-weight: 500;">This action cannot be undone.</span></p>
        </div>
        <div class="modal-footer" style="border-top: none;">
          <button class="btn btn-outline" style="border-radius: 9999px;" @click="showApproveModal = false">Cancel</button>
          <button class="btn btn-approve" :disabled="processing" style="border-radius: 9999px;" @click="confirmApprove">
            {{ processing && processingAction === 'approve' ? 'Approving…' : 'Yes, Approve' }}
          </button>
        </div>
      </div>
    </div>

    <FilePreview :show="showFilePreview" :file="previewFile" @close="showFilePreview = false" />
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import FilePreview from './FilePreview.vue'
import { allVouchers, loadingVouchers, userEmail, API_BASE, updateVoucherStatus } from './stores/appState'

const router = useRouter()
const selectedVoucher = ref(null)
const showFilePreview = ref(false)
const previewFile = ref(null)
const expandedPurposes = reactive({})
const processing = ref(false)
const processingAction = ref('')
const showDeclineModal = ref(false)
const showApproveModal = ref(false)

function togglePurpose(id) {
  expandedPurposes[id] = !expandedPurposes[id]
}

function goToForm() {
  router.push({ name: 'form' })
}

function openVoucher(voucher) {
  selectedVoucher.value = voucher
}

async function setDecision(status) {
  if (!selectedVoucher.value) return
  await updateVoucherStatus(selectedVoucher.value.id, status)
  const updated = allVouchers.value.find((v) => v.id === selectedVoucher.value.id)
  if (updated) selectedVoucher.value = updated
}

async function notifyCcOfApproval() {
  if (!selectedVoucher.value?.cc) return
  try {
    await fetch(`${API_BASE}/api/email/send-approved-cc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cc: selectedVoucher.value.cc,
        voucherNo: selectedVoucher.value.id,
        from: selectedVoucher.value.from,
        to: selectedVoucher.value.to,
        subject: selectedVoucher.value.subject,
        submittedBy: selectedVoucher.value.submittedBy,
        amount: selectedVoucher.value.amount,
        payee: selectedVoucher.value.payee,
        department: selectedVoucher.value.department,
        purpose: selectedVoucher.value.purpose,
        submissionDate: selectedVoucher.value.submissionDate,
        supportingDocs: selectedVoucher.value.supportingDocs,
      }),
    })
  } catch (error) {
    console.error('Failed to send CC approval email:', error)
  }
}

async function confirmApprove() {
  if (processing.value) return
  processing.value = true
  processingAction.value = 'approve'
  try {
    await setDecision('Approved')
    await notifyCcOfApproval()
  } finally {
    processing.value = false
    processingAction.value = ''
  }
  showApproveModal.value = false
}

async function confirmDecline() {
  if (processing.value) return
  processing.value = true
  processingAction.value = 'decline'
  try {
    await setDecision('Declined')
  } finally {
    processing.value = false
    processingAction.value = ''
  }
  showDeclineModal.value = false
}

function openFilePreview(doc) {
  previewFile.value = doc
  showFilePreview.value = true
}

const activeTab = ref('sent')
const sentVouchers = computed(() =>
  allVouchers.value.filter((voucher) => voucher.submittedBy === userEmail.value),
)
const receivedVouchers = computed(() =>
  allVouchers.value.filter((voucher) => voucher.to === userEmail.value),
)
const displayedVouchers = computed(() =>
  activeTab.value === 'sent' ? sentVouchers.value : receivedVouchers.value,
)

</script>

<style scoped>
.vouchers-table th:nth-child(2),
.vouchers-table td:nth-child(2) {
  text-align: center;
}

.voucher-purpose {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  white-space: normal;
  overflow-wrap: break-word;
  cursor: pointer;
  color: #000;
}

.voucher-purpose.expanded {
  -webkit-line-clamp: unset;
  line-clamp: unset;
  display: block;
}

.vouchers-loading {
  display: grid;
  place-items: center;
  min-height: 60vh;
  color: #000;
  font-size: 20px;
  font-weight: 700;
}
</style>
