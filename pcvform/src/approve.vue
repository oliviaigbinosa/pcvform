<template>
  <div class="page-wrap">
    <template v-if="loadingVouchers"></template>

    <div v-else-if="voucher" class="voucher-detail">
      <div v-if="voucher.status === 'Approved'" class="approve-message card success">
        This voucher form has been approved
      </div>
      <div v-else-if="voucher.status === 'Declined'" class="approve-message card declined">
        This voucher form has been declined
      </div>
      <div v-else class="approve-actions-bar">
        <button class="btn btn-approve" :disabled="processing" @click="approve">
          {{ processing && processingAction === 'approve' ? 'Approving…' : 'Approve' }}
        </button>
        <button class="btn btn-decline" @click="showDeclineModal = true">Decline</button>
      </div>

      <div class="card">
        <div class="preview-head">
          <div>
            <p class="company-label">Getpayed Technology Solutions Ltd.</p>
            <h2 class="preview-title serif">Petty Cash Voucher</h2>
          </div>
          <div class="preview-head__right">
            <p class="mono-label tiny">Voucher No.</p>
            <code class="voucher-no">{{ voucher.id }}</code>
          </div>
        </div>

        <div class="preview-section">
          <h3 class="preview-section__title mono-label">Email Details</h3>
          <div class="preview-rows">
            <div class="preview-row">
              <span>From</span><span>{{ voucher.from || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>To</span><span>{{ voucher.to || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>CC</span><span>{{ voucher.cc || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>Subject</span><span>{{ voucher.subject || '—' }}</span>
            </div>
          </div>
        </div>

        <div class="preview-section">
          <h3 class="preview-section__title mono-label">Payee Information</h3>
          <div class="preview-rows">
            <div class="preview-row">
              <span>Payee</span><span>{{ voucher.payee || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>Department</span><span>{{ voucher.department || '—' }}</span>
            </div>
          </div>
        </div>

        <div class="preview-section">
          <h3 class="preview-section__title mono-label">Amount &amp; Purpose</h3>
          <div class="preview-rows">
            <div class="preview-row">
              <span>Amount (Figures)</span>
              <span class="mono-input">₦{{ voucher.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00' }}</span>
            </div>
            <div class="preview-row">
              <span>Amount (Words)</span><span>{{ voucher.amountWords || '—' }}</span>
            </div>
            <div class="preview-row block-row">
              <span>Purpose</span><span>{{ voucher.purpose || '—' }}</span>
            </div>
          </div>
        </div>

        <div class="preview-section">
          <h3 class="preview-section__title mono-label">Supporting Documents</h3>
          <div class="preview-rows">
            <div class="preview-row">
              <span>Submission Date</span><span>{{ voucher.submissionDate || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>Attached Files</span>
              <span>
                <template v-if="voucher.supportingDocs?.length">
                  <span v-for="(doc, i) in voucher.supportingDocs" :key="i">
                    <a
                      v-if="typeof doc === 'object' && doc?.data"
                      class="file-link"
                      href="#"
                      @click.prevent="openFilePreview(doc)"
                    >{{ doc.name }}</a>
                    <span v-else>{{ typeof doc === 'string' ? doc : doc?.name || '—' }}</span>
                    {{ i < voucher.supportingDocs.length - 1 ? ', ' : '' }}
                  </span>
                </template>
                <template v-else>None</template>
              </span>
            </div>
          </div>
        </div>

        <div class="amount-banner">
          <span class="mono-label">Total Amount</span>
          <span class="amount-total serif">₦{{ voucher.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00' }}</span>
        </div>
      </div>
    </div>

    <div v-else class="vouchers-empty card">
      <p class="vouchers-empty__title">Voucher not found</p>
      <p class="vouchers-empty__sub">The voucher you are looking for does not exist or has been removed.</p>
    </div>

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

    <FilePreview :show="showFilePreview" :file="previewFile" @close="showFilePreview = false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import FilePreview from './FilePreview.vue'
import { allVouchers, loadingVouchers, updateVoucherStatus } from './stores/appState'

const route = useRoute()
const showFilePreview = ref(false)
const previewFile = ref(null)
const showDeclineModal = ref(false)
const processing = ref(false)
const processingAction = ref('')

const voucherId = computed(() => route.query.id || '')
const voucher = computed(() =>
  allVouchers.value.find((v) => v.id === voucherId.value),
)

function openFilePreview(doc) {
  previewFile.value = doc
  showFilePreview.value = true
}

async function setDecision(status) {
  if (!voucher.value) return
  await updateVoucherStatus(voucher.value.id, status)
}

async function notifyCcOfApproval() {
  if (!voucher.value?.cc) return
  try {
    await fetch('/api/email/send-approved-cc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cc: voucher.value.cc,
        voucherNo: voucher.value.id,
        from: voucher.value.from,
        to: voucher.value.to,
        subject: voucher.value.subject,
        submittedBy: voucher.value.submittedBy,
        amount: voucher.value.amount,
        payee: voucher.value.payee,
        department: voucher.value.department,
        purpose: voucher.value.purpose,
        submissionDate: voucher.value.submissionDate,
        supportingDocs: voucher.value.supportingDocs,
      }),
    })
  } catch (error) {
    console.error('Failed to send CC approval email:', error)
  }
}

async function approve() {
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
</script>
