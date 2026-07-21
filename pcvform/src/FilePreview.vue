<template>
  <div v-if="show" class="modal-backdrop file-preview-backdrop" @click.self="close">
    <div class="modal file-preview-modal">
      <div class="modal-header file-preview-header">
        <div class="modal-header__title">{{ file?.name }}</div>
        <button type="button" class="modal-close" @click="close" aria-label="Close">✕</button>
      </div>

      <div class="modal-body file-preview-body">
        <img
          v-if="isImage"
          :src="file?.data"
          :alt="file?.name"
          class="file-preview-content file-preview-content--image"
        />
        <object
          v-else-if="isPdf"
          :data="file?.data"
          type="application/pdf"
          class="file-preview-content file-preview-content--pdf"
        ></object>
        <div v-else class="file-preview-fallback">
          <div class="file-preview-fallback__icon">📄</div>
          <p class="file-preview-fallback__text">Preview not available for this file type.</p>
          <a :href="file?.data" :download="file?.name" class="btn btn-primary">
            Download {{ file?.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  file: Object,
})

const emit = defineEmits(['close'])

const isImage = computed(() => props.file?.type?.startsWith('image/'))
const isPdf = computed(
  () =>
    props.file?.type === 'application/pdf' ||
    props.file?.name?.toLowerCase().endsWith('.pdf'),
)

function close() {
  emit('close')
}
</script>

<style scoped>
.file-preview-backdrop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 16px;
}

.file-preview-header {
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0;
}

.file-preview-header .modal-header__title {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary);
  font-size: 15px;
  font-weight: 700;
}

.file-preview-header .modal-close {
  background: #dc2626;
  color: #fff;
}

.file-preview-header .modal-close:hover {
  background: #b91c1c;
  color: #fff;
}

.file-preview-modal {
  width: 100%;
  max-width: min(1000px, calc(100vw - 32px));
  display: flex;
  flex-direction: column;
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
  gap: 20px;
}

.file-preview-body {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  gap: 0;
  overflow: hidden;
  background: transparent;
}

.file-preview-content {
  display: block;
  border: none;
  background: transparent;
}

.file-preview-content--image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: calc(90vh - 120px);
  object-fit: contain;
  object-position: center;
}

.file-preview-content--pdf {
  width: min(80vw, 800px);
  height: calc(70vh - 62px);
}

.file-preview-fallback {
  padding: 64px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--muted-fg);
}

.file-preview-fallback__icon {
  font-size: 42px;
  margin-bottom: 8px;
  opacity: 0.75;
}

.file-preview-fallback__text {
  margin-bottom: 20px;
  font-size: 15px;
  color: var(--muted-fg);
}
</style>
