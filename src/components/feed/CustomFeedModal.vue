<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fa-solid fa-sliders text-primary"></i> Create Custom Feed</h3>
        <button class="btn-icon btn-sm" @click="$emit('close')"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Feed Name:</label>
          <input type="text" v-model="name" placeholder="e.g. AI & Vue Developers" class="form-input" />
        </div>

        <div class="form-group">
          <label>Description:</label>
          <input type="text" v-model="description" placeholder="Brief summary of what this feed tracks..." class="form-input" />
        </div>

        <div class="form-group">
          <label>Filter by Topics:</label>
          <div class="chip-picker">
            <span
              v-for="t in store.topics"
              :key="t.id"
              class="chip"
              :class="{ selected: selectedTopics.includes(t.name) }"
              @click="toggleTopic(t.name)"
            >
              #{{ t.name }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>Filter by Users:</label>
          <div class="chip-picker">
            <span
              v-for="u in store.users"
              :key="u.id"
              class="chip"
              :class="{ selected: selectedUsers.includes(u.username) }"
              @click="toggleUser(u.username)"
            >
              @{{ u.username }}
            </span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-outline" @click="$emit('close')">Cancel</button>
        <button class="btn-primary" :disabled="!name.trim()" @click="submit">
          Save Feed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const emit = defineEmits(['close'])

const store = useThreadsStore()

const name = ref('')
const description = ref('')
const selectedTopics = ref([])
const selectedUsers = ref([])

function toggleTopic(topicName) {
  const idx = selectedTopics.value.indexOf(topicName)
  if (idx >= 0) selectedTopics.value.splice(idx, 1)
  else selectedTopics.value.push(topicName)
}

function toggleUser(username) {
  const idx = selectedUsers.value.indexOf(username)
  if (idx >= 0) selectedUsers.value.splice(idx, 1)
  else selectedUsers.value.push(username)
}

function submit() {
  store.createCustomFeed(
    name.value.trim(),
    description.value.trim(),
    selectedTopics.value,
    selectedUsers.value
  )
  emit('close')
}
</script>

<style scoped>
.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 13px;
  outline: none;
}

.form-input:focus {
  border-color: var(--primary-color);
}

.chip-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
  border: 1px solid var(--border-color-darker);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip.selected {
  background: rgba(80, 181, 255, 0.15);
  color: var(--primary-color);
  border-color: var(--primary-color);
  font-weight: 700;
}
</style>
