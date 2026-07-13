<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="closeModal">
    <div class="modal" role="dialog" aria-modal="true" aria-label="Form Preview">
      <div class="modal-header">
        <div class="modal-header__title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Form Preview
        </div>
        <button class="modal-close" @click="closeModal" aria-label="Close">✕</button>
      </div>

      <div class="modal-body">
        <div class="preview-head">
          <div>
            <p class="company-label">Getpayed Technology Solutions Ltd.</p>
            <h2 class="preview-title serif">Petty Cash Voucher</h2>
          </div>
          <div class="preview-head__right">
            <p class="mono-label tiny">Voucher No.</p>
            <code class="voucher-no">{{ voucherNo }}</code>
          </div>
        </div>

        <div class="preview-section">
          <h3 class="preview-section__title mono-label">Email Details</h3>
          <div class="preview-rows">
            <div class="preview-row">
              <span>From</span><span>{{ form.from || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>To</span><span>{{ form.to || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>CC</span><span>{{ form.cc || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>Subject</span><span>{{ form.subject || '—' }}</span>
            </div>
          </div>
        </div>

        <div class="preview-section">
          <h3 class="preview-section__title mono-label">Payee Information</h3>
          <div class="preview-rows">
            <div class="preview-row">
              <span>Date</span><span>{{ form.date || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>Payee</span><span>{{ form.payee || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>Department</span><span>{{ form.department || '—' }}</span>
            </div>
          </div>
        </div>

        <div class="preview-section">
          <h3 class="preview-section__title mono-label">Amount &amp; Purpose</h3>
          <div class="preview-rows">
            <div class="preview-row">
              <span>Amount (Figures)</span>
              <span class="mono-input">₦{{ parsedAmount.toFixed(2) }}</span>
            </div>
            <div class="preview-row">
              <span>Amount (Words)</span><span>{{ form.amountWords || '—' }}</span>
            </div>
            <div class="preview-row block-row">
              <span>Purpose</span><span>{{ form.purpose || '—' }}</span>
            </div>
          </div>
        </div>

        <div class="preview-section">
          <h3 class="preview-section__title mono-label">Supporting Documents</h3>
          <div class="preview-rows">
            <div class="preview-row">
              <span>Submission Date</span><span>{{ form.submissionDate || '—' }}</span>
            </div>
            <div class="preview-row">
              <span>Attached Files</span>
              <span>{{
                form.supportingDocs.length
                  ? form.supportingDocs.map((f) => f.name).join(', ')
                  : 'None'
              }}</span>
            </div>
          </div>
        </div>

        <div class="amount-banner">
          <span class="mono-label">Total Amount</span>
          <span class="amount-total serif">₦{{ parsedAmount.toFixed(2) }}</span>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-outline" @click="closeModal">Back to Edit</button>
        <button class="btn btn-primary" @click="sendVoucher">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Send Voucher
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  form: {
    type: Object,
    required: true,
  },
  voucherNo: {
    type: String,
    required: true,
  },
  parsedAmount: {
    type: Number,
    required: true,
  },
  userEmail: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['submit', 'update:modelValue'])

const pendingSubmission = ref(false)

function closeModal() {
  emit('update:modelValue', false)
}

function cleanupListeners() {
  window.removeEventListener('focus', handleReturnToApp)
  document.removeEventListener('visibilitychange', handleReturnToApp)
}

function completeSubmission() {
  if (!pendingSubmission.value) {
    return
  }

  cleanupListeners()
  pendingSubmission.value = false
  emit('submit')
  closeModal()
}

function handleReturnToApp() {
  if (pendingSubmission.value && (document.visibilityState === 'visible' || document.hasFocus())) {
    completeSubmission()
  }
}

function sendVoucher() {
  if (pendingSubmission.value) {
    return
  }

  pendingSubmission.value = true
  window.addEventListener('focus', handleReturnToApp)
  document.addEventListener('visibilitychange', handleReturnToApp)

  const mailto = [
    `mailto:${encodeURIComponent(props.form.to)}`,
    `?subject=${encodeURIComponent(props.form.subject)}`,
    `&cc=${encodeURIComponent(props.form.cc)}`,
    `&reply-to=${encodeURIComponent(props.form.from)}`,
    `&body=${encodeURIComponent(buildBody())}`,
  ].join('')

  try {
    window.location.href = mailto
  } catch (error) {
    cleanupListeners()
    pendingSubmission.value = false
    console.error('Voucher email launch failed', error)
    window.alert(
      'We could not open your mail service. Please copy the voucher details manually and try again.',
    )
  }
}

onBeforeUnmount(() => {
  cleanupListeners()
})

function buildBody() {
  const docs = props.form.supportingDocs.length
    ? props.form.supportingDocs.map((f) => `  • ${f.name}`).join('\n')
    : '  None attached'
  return `PETTY CASH VOUCHER\n${'═'.repeat(52)}\nVoucher No.:      ${props.voucherNo}\nCompany:          Getpayed Technology Solutions Ltd.\nSubmitted By:     ${props.userEmail}\n\nEMAIL DETAILS\n${'─'.repeat(52)}\nFrom:             ${props.form.from}\nTo:               ${props.form.to}\nCC:               ${props.form.cc}\nSubject:          ${props.form.subject}\n\nPAYEE INFORMATION\n${'─'.repeat(52)}\nDate:             ${props.form.date}\nPayee:            ${props.form.payee}\nDepartment:       ${props.form.department}\n\nAMOUNT & PURPOSE\n${'─'.repeat(52)}\nAmount (Figures): ₦${props.parsedAmount.toFixed(2)}\nAmount (Words):   ${props.form.amountWords}\n\nPurpose / Description:\n${props.form.purpose}\n\nSUPPORTING DOCUMENTS\n${'─'.repeat(52)}\nSubmission Date:  ${props.form.submissionDate}\nAttached Files:\n${docs}\n\n${'═'.repeat(52)}\nThis voucher was generated by the Petty Cash Voucher System.`
}
</script>
