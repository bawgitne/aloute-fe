<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fa-solid fa-user-pen text-primary"></i> Edit Profile</h3>
        <button class="btn-icon btn-sm" @click="$emit('close')"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Display Name:</label>
          <input type="text" v-model="displayName" class="form-input" />
        </div>

        <div class="form-group">
          <label>Bio:</label>
          <textarea v-model="bio" rows="3" class="form-input"></textarea>
        </div>

        <div class="form-group">
          <label>Website URL:</label>
          <input type="text" v-model="website" class="form-input" />
        </div>

        <div class="form-group">
          <label>Avatar Image URL:</label>
          <input type="text" v-model="avatar" class="form-input" />
        </div>

        <div class="form-group">
          <label>Cover Banner Image URL:</label>
          <input type="text" v-model="cover" class="form-input" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-outline" @click="$emit('close')">Cancel</button>
        <button class="btn-primary" @click="save">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const emit = defineEmits(['close'])
const { currentUser } = useThreadsStore()

const displayName = ref(currentUser.display_name)
const bio = ref(currentUser.bio)
const website = ref(currentUser.website)
const avatar = ref(currentUser.avatar)
const cover = ref(currentUser.cover)

function save() {
  currentUser.display_name = displayName.value
  currentUser.bio = bio.value
  currentUser.website = website.value
  currentUser.avatar = avatar.value
  currentUser.cover = cover.value
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
  font-family: inherit;
}

.form-input:focus {
  border-color: var(--primary-color);
}
</style>
