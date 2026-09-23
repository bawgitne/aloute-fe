<template>
  <div v-if="isReportModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fa-solid fa-flag text-danger"></i> Report Content</h3>
        <button class="btn-icon btn-sm" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="modal-body">
        <p class="report-subtitle">
          Help us maintain a safe community. Why are you reporting this item?
        </p>

        <div class="reason-options">
          <label
            v-for="r in reasons"
            :key="r.val"
            class="reason-card"
            :class="{ selected: selectedReason === r.val }"
          >
            <input type="radio" v-model="selectedReason" :value="r.val" />
            <div>
              <strong>{{ r.title }}</strong>
              <small>{{ r.desc }}</small>
            </div>
          </label>
        </div>

        <div class="additional-details">
          <label>Additional Information (Optional):</label>
          <textarea
            v-model="description"
            placeholder="Provide context for our moderation team..."
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-outline" @click="closeModal">Cancel</button>
        <button class="btn-primary btn-danger-bg" :disabled="!selectedReason" @click="submit">
          Submit Report
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const { isReportModalOpen, submitReport } = useThreadsStore()

const selectedReason = ref('SPAM')
const description = ref('')

const reasons = [
  { val: 'SPAM', title: 'Spam or Bot Activity', desc: 'Repetitive messages, fake links, or automated behavior.' },
  { val: 'HARASSMENT', title: 'Harassment & Bullying', desc: 'Targeting individuals with insults, threats, or stalking.' },
  { val: 'HATE', title: 'Hate Speech', desc: 'Discrimination based on identity, race, religion, or orientation.' },
  { val: 'MISINFORMATION', title: 'Misinformation', desc: 'False or misleading facts intended to harm.' },
  { val: 'VIOLENCE', title: 'Violence or Dangerous Content', desc: 'Encouraging harm or illegal acts.' },
  { val: 'OTHER', title: 'Other Issue', desc: 'Any other violation of community guidelines.' }
]

function closeModal() {
  isReportModalOpen.value = false
}

function submit() {
  submitReport(selectedReason.value, description.value)
  description.value = ''
}
</script>

<style scoped>
.report-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.reason-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.reason-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.reason-card.selected {
  border-color: var(--danger-color);
  background: rgba(255, 82, 82, 0.05);
}

.reason-card strong {
  display: block;
  font-size: 13px;
}

.reason-card small {
  font-size: 11px;
  color: var(--text-muted);
}

.additional-details label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-main);
  display: block;
  margin-bottom: 6px;
}

.additional-details textarea {
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-family: inherit;
  font-size: 13px;
  outline: none;
}

.btn-danger-bg {
  background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%);
  box-shadow: 0 4px 12px rgba(255, 82, 82, 0.3);
}
</style>
