<template>
  <div class="app-wrap">
    <!-- ── Success screen ── -->
    <div v-if="submitted" class="card success-card">
      <div class="success-icon">✓</div>
      <h2 class="serif">Voucher Submitted</h2>
      <p>Your email client has opened with the voucher pre-filled and ready to send.</p>
      <code class="voucher-badge">{{ lastVoucherNo }}</code>
      <button class="btn btn-primary" @click="reset">Create New Voucher</button>
    </div>

    <!-- ── Main form ── -->
    <div v-else class="container">
      <!-- Header -->
      <header class="pcv-header">
        <div class="pcv-header__left">
          <div class="pcv-logo">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <div>
            <p class="company-label">Getpayed technology solutions ltd</p>
            <h1 class="serif">Petty Cash Voucher</h1>
          </div>
        </div>
        <div class="pcv-header__right">
          <p class="mono-label">Voucher No.</p>
          <code class="voucher-no">{{ voucherNo }}</code>
        </div>
      </header>

      <!-- Stepper -->
      <nav class="stepper" aria-label="Form steps">
        <div
          v-for="(label, i) in STEPS"
          :key="i"
          class="stepper__item"
          :class="{ done: i < step, active: i === step }"
        >
          <div class="stepper__bubble">
            <svg
              v-if="i < step"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="stepper__label">{{ label }}</span>
        </div>
      </nav>

      <!-- Step card -->
      <div class="card step-card">
        <!-- Step 0: Email Details -->
        <template v-if="step === 0">
          <div class="step-head">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <h2>Email Details</h2>
          </div>
          <div class="fields">
            <div class="field">
              <label class="mono-label">From (Sender Email) <span class="req">*</span></label>
              <input
                v-model="form.from"
                type="email"
                placeholder="yourname@company.com"
                :class="{ error: errors.from }"
                @input="clearErr('from')"
              />
              <span v-if="errors.from" class="err-msg">{{ errors.from }}</span>
            </div>
            <div class="field">
              <label class="mono-label">To (Recipient Email) <span class="req">*</span></label>
              <input
                v-model="form.to"
                type="email"
                placeholder="manager@company.com"
                :class="{ error: errors.to }"
                @input="clearErr('to')"
              />
              <span v-if="errors.to" class="err-msg">{{ errors.to }}</span>
            </div>
            <div class="field">
              <label class="mono-label">CC</label>
              <input v-model="form.cc" type="email" placeholder="finance@gmail.com" />
              <span class="hint">Defaults to finance@gmail.com</span>
            </div>
            <div class="field">
              <label class="mono-label">Subject <span class="req">*</span></label>
              <input
                v-model="form.subject"
                type="text"
                placeholder="Petty Cash Request — Department — Month Year"
                :class="{ error: errors.subject }"
                @input="clearErr('subject')"
              />
              <span v-if="errors.subject" class="err-msg">{{ errors.subject }}</span>
            </div>
          </div>
        </template>

        <!-- Step 1: Payee Info -->
        <template v-else-if="step === 1">
          <div class="step-head">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <h2>Payee Information</h2>
          </div>
          <div class="fields">
            <div class="field">
              <label class="mono-label">Date <span class="req">*</span></label>
              <input
                v-model="form.date"
                type="date"
                :class="{ error: errors.date }"
                @change="clearErr('date')"
              />
              <span v-if="errors.date" class="err-msg">{{ errors.date }}</span>
            </div>
            <div class="field">
              <label class="mono-label">Payee (Person / Vendor) <span class="req">*</span></label>
              <input
                v-model="form.payee"
                type="text"
                placeholder="e.g. John Adeyemi / Staples Ltd."
                :class="{ error: errors.payee }"
                @input="clearErr('payee')"
              />
              <span v-if="errors.payee" class="err-msg">{{ errors.payee }}</span>
            </div>
            <div class="field">
              <label class="mono-label">Department <span class="req">*</span></label>
              <input
                v-model="form.department"
                type="text"
                placeholder="e.g. Marketing, Operations, HR"
                :class="{ error: errors.department }"
                @input="clearErr('department')"
              />
              <span v-if="errors.department" class="err-msg">{{ errors.department }}</span>
              <span class="hint">Populates the voucher number above.</span>
            </div>
          </div>
        </template>

        <!-- Step 2: Amount & Purpose -->
        <template v-else-if="step === 2">
          <div class="step-head">
            <span class="dollar-icon">$</span>
            <h2>Amount &amp; Purpose</h2>
          </div>
          <div class="fields">
            <div class="field">
              <label class="mono-label">Amount in Figures (USD) <span class="req">*</span></label>
              <div class="input-prefix">
                <span class="prefix">$</span>
                <input
                  v-model="form.amountFigures"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  class="mono-input"
                  :class="{ error: errors.amountFigures }"
                  @input="clearErr('amountFigures')"
                />
              </div>
              <span v-if="errors.amountFigures" class="err-msg">{{ errors.amountFigures }}</span>
            </div>
            <div class="field">
              <label class="mono-label">Amount in Words</label>
              <textarea
                v-model="form.amountWords"
                rows="2"
                placeholder="Auto-generated from the figure above"
              ></textarea>
              <span class="hint">Auto-filled — edit if needed.</span>
            </div>
            <div class="field">
              <label class="mono-label">Purpose / Description <span class="req">*</span></label>
              <textarea
                v-model="form.purpose"
                rows="4"
                placeholder="Describe what this petty cash is for..."
                :class="{ error: errors.purpose }"
                @input="clearErr('purpose')"
              ></textarea>
              <span v-if="errors.purpose" class="err-msg">{{ errors.purpose }}</span>
            </div>
          </div>
        </template>

        <!-- Step 3: Supporting Docs -->
        <template v-else-if="step === 3">
          <div class="step-head">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
            <h2>Supporting Documents</h2>
          </div>
          <div class="fields">
            <div class="field">
              <label class="mono-label">Submission Date <span class="req">*</span></label>
              <input
                v-model="form.submissionDate"
                type="date"
                :class="{ error: errors.submissionDate }"
                @change="clearErr('submissionDate')"
              />
              <span v-if="errors.submissionDate" class="err-msg">{{ errors.submissionDate }}</span>
            </div>
            <div class="field">
              <label class="mono-label">Attach Supporting Documents</label>
              <button type="button" class="upload-zone" @click="$refs.fileInput.click()">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                <span class="upload-title">Click to attach files</span>
                <span class="upload-hint">Receipts, invoices, approvals — any format</span>
              </button>
              <input
                ref="fileInput"
                type="file"
                multiple
                style="display: none"
                @change="handleFiles"
              />
              <ul v-if="form.supportingDocs.length" class="file-list">
                <li v-for="(file, i) in form.supportingDocs" :key="i" class="file-item">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span class="file-name">{{ file.name }}</span>
                  <button
                    type="button"
                    class="file-remove"
                    @click="removeFile(i)"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </li>
              </ul>
              <span class="hint">Files are listed in the email body.</span>
            </div>

            <button type="button" class="btn btn-accent review-btn" @click="openPreview">
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
              Review Form
            </button>
          </div>
        </template>
      </div>

      <!-- Navigation -->
      <div class="nav-row">
        <button class="btn btn-outline" :disabled="step === 0" @click="back">
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
        <span class="step-counter mono-label">Step {{ step + 1 }} of {{ STEPS.length }}</span>
        <button v-if="step < STEPS.length - 1" class="btn btn-primary" @click="next">
          Next
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <button v-else class="btn btn-primary" @click="openPreview">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Review &amp; Send
        </button>
      </div>
    </div>

    <!-- ── Preview Modal ── -->
    <Teleport to="body">
      <div v-if="showPreview" class="modal-backdrop" @click.self="showPreview = false">
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
            <button class="modal-close" @click="showPreview = false" aria-label="Close">✕</button>
          </div>

          <div class="modal-body">
            <div class="preview-head">
              <div>
                <p class="company-label">Acme Corporation Ltd.</p>
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
                  <span class="mono-input">${{ parsedAmount.toFixed(2) }}</span>
                </div>
                <div class="preview-row">
                  <span>Amount (Words)</span><span>{{ form.amountWords || '—' }}</span>
                </div>
                <div class="preview-row block-row">
                  <span>Purpose</span>
                  <span>{{ form.purpose || '—' }}</span>
                </div>
              </div>
            </div>

            <div class="preview-section">
              <h3 class="preview-section__title mono-label">Supporting Documents</h3>
              <div class="preview-rows">
                <div class="preview-row">
                  <span>Submission Date</span>
                  <span>{{ form.submissionDate || '—' }}</span>
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
              <span class="amount-total serif">${{ parsedAmount.toFixed(2) }}</span>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" @click="showPreview = false">Back to Edit</button>
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
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = ['Email Details', 'Payee Info', 'Amount & Purpose', 'Documents & Review']

// ─── Number → words ───────────────────────────────────────────────────────────
const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
]
const tensArr = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
]

function belowThousand(n) {
  if (n === 0) return ''
  if (n < 20) return ones[n] + ' '
  if (n < 100) return tensArr[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '') + ' '
  return ones[Math.floor(n / 100)] + ' Hundred ' + belowThousand(n % 100)
}

function numberToWords(amount) {
  if (isNaN(amount) || amount <= 0) return ''
  const dollars = Math.floor(amount)
  const cents = Math.round((amount - dollars) * 100)
  const chunks = [
    { val: Math.floor(dollars / 1_000_000), label: 'Million' },
    { val: Math.floor((dollars % 1_000_000) / 1_000), label: 'Thousand' },
    { val: dollars % 1_000, label: '' },
  ]
  let words = chunks
    .filter((c) => c.val > 0)
    .map((c) => belowThousand(c.val) + c.label)
    .join(' ')
    .trim()
  words += ' Dollar' + (dollars !== 1 ? 's' : '')
  if (cents > 0) words += ' and ' + belowThousand(cents).trim() + ' Cent' + (cents !== 1 ? 's' : '')
  return words + ' Only'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pad(n) {
  return String(n).padStart(2, '0')
}
function currentYear() {
  return new Date().getFullYear()
}
function currentMonth() {
  return pad(new Date().getMonth() + 1)
}
function monthName(m) {
  return (
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
      parseInt(m) - 1
    ] ?? m
  )
}
function todayStr() {
  return new Date().toISOString().split('T')[0]
}
function makeSerial() {
  return String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')
}
function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

// ─── State ────────────────────────────────────────────────────────────────────
const voucherSerial = ref(makeSerial())
const step = ref(0)
const showPreview = ref(false)
const submitted = ref(false)
const lastVoucherNo = ref('')
const fileInput = ref(null)

const form = reactive({
  from: '',
  to: '',
  cc: 'finance@gmail.com',
  subject: '',
  date: todayStr(),
  payee: '',
  department: '',
  amountFigures: '',
  amountWords: '',
  purpose: '',
  supportingDocs: [],
  submissionDate: todayStr(),
})

const errors = reactive({})

// ─── Computed ─────────────────────────────────────────────────────────────────
const deptSlug = computed(() => form.department.trim().toUpperCase().replace(/\s+/g, '-') || 'DEPT')

const voucherNo = computed(
  () => `PCV/${deptSlug.value}/${currentYear()}/${currentMonth()}/${voucherSerial.value}`,
)

const parsedAmount = computed(() => parseFloat(form.amountFigures) || 0)

// ─── Watchers ─────────────────────────────────────────────────────────────────
watch(
  () => form.department,
  (dept) => {
    if (!form.subject || form.subject.startsWith('Petty Cash Request')) {
      form.subject = `Petty Cash Request — ${dept || 'Department'} — ${monthName(currentMonth())} ${currentYear()}`
    }
  },
)

watch(
  () => form.amountFigures,
  (val) => {
    form.amountWords = numberToWords(parseFloat(val))
  },
)

// ─── Validation ───────────────────────────────────────────────────────────────
const validators = {
  0() {
    const e = {}
    if (!isEmail(form.from)) e.from = 'Valid sender email required'
    if (!isEmail(form.to)) e.to = 'Valid recipient email required'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    return e
  },
  1() {
    const e = {}
    if (!form.date) e.date = 'Date is required'
    if (!form.payee.trim()) e.payee = 'Payee name is required'
    if (!form.department.trim()) e.department = 'Department is required'
    return e
  },
  2() {
    const e = {}
    const n = parseFloat(form.amountFigures)
    if (!form.amountFigures || isNaN(n) || n <= 0) e.amountFigures = 'Enter a valid amount'
    if (!form.purpose.trim()) e.purpose = 'Purpose is required'
    return e
  },
  3() {
    const e = {}
    if (!form.submissionDate) e.submissionDate = 'Submission date is required'
    return e
  },
}

function validate() {
  const errs = validators[step.value]?.() ?? {}
  Object.assign(errors, errs)
  Object.keys(errors).forEach((k) => {
    if (!errs[k]) delete errors[k]
  })
  return Object.keys(errs).length === 0
}

function clearErr(key) {
  delete errors[key]
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function next() {
  if (validate()) step.value = Math.min(step.value + 1, STEPS.length - 1)
}

function back() {
  Object.keys(errors).forEach((k) => delete errors[k])
  step.value = Math.max(step.value - 1, 0)
}

function openPreview() {
  if (validate()) showPreview.value = true
}

// ─── File handling ────────────────────────────────────────────────────────────
function handleFiles(e) {
  form.supportingDocs.push(...Array.from(e.target.files ?? []))
  e.target.value = ''
}

function removeFile(i) {
  form.supportingDocs.splice(i, 1)
}

// ─── Email build & send ───────────────────────────────────────────────────────
function buildBody() {
  const docs = form.supportingDocs.length
    ? form.supportingDocs.map((f) => `  • ${f.name}`).join('\n')
    : '  None attached'
  return `PETTY CASH VOUCHER
${'═'.repeat(52)}
Voucher No.:      ${voucherNo.value}
Company:          Acme Corporation Ltd.

EMAIL DETAILS
${'─'.repeat(52)}
From:             ${form.from}
To:               ${form.to}
CC:               ${form.cc}
Subject:          ${form.subject}

PAYEE INFORMATION
${'─'.repeat(52)}
Date:             ${form.date}
Payee:            ${form.payee}
Department:       ${form.department}

AMOUNT & PURPOSE
${'─'.repeat(52)}
Amount (Figures): $${parsedAmount.value.toFixed(2)}
Amount (Words):   ${form.amountWords}

Purpose / Description:
${form.purpose}

SUPPORTING DOCUMENTS
${'─'.repeat(52)}
Submission Date:  ${form.submissionDate}
Attached Files:
${docs}

${'═'.repeat(52)}
This voucher was generated by the Petty Cash Voucher System.
Submitted by: ${form.from}`
}

function sendVoucher() {
  const url = [
    `mailto:${encodeURIComponent(form.to)}`,
    `?subject=${encodeURIComponent(form.subject)}`,
    `&cc=${encodeURIComponent(form.cc)}`,
    `&body=${encodeURIComponent(buildBody())}`,
  ].join('')
  window.location.href = url
  lastVoucherNo.value = voucherNo.value
  showPreview.value = false
  submitted.value = true
}

function reset() {
  Object.assign(form, {
    from: '',
    to: '',
    cc: 'finance@gmail.com',
    subject: '',
    date: todayStr(),
    payee: '',
    department: '',
    amountFigures: '',
    amountWords: '',
    purpose: '',
    supportingDocs: [],
    submissionDate: todayStr(),
  })
  voucherSerial.value = makeSerial()
  step.value = 0
  submitted.value = false
  Object.keys(errors).forEach((k) => delete errors[k])
}
</script>
