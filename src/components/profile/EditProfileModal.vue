<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content max-w-lg">
      <div class="modal-header">
        <h3><i class="fa-solid fa-user-pen text-primary"></i> Chỉnh Sửa Hồ Sơ</h3>
        <button class="btn-icon btn-sm" @click="$emit('close')"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="modal-body space-y-4">
        <div class="form-group">
          <label>Tên Hiển Thị:</label>
          <input type="text" v-model="displayName" class="form-input" />
        </div>

        <div class="form-group">
          <label>Bio (Giới thiệu):</label>
          <textarea v-model="bio" rows="3" class="form-input"></textarea>
        </div>

        <div class="form-group">
          <label class="flex items-center gap-2 cursor-pointer font-bold text-sm text-indigo-300">
            <input type="checkbox" v-model="isPrivate" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
            <span>🔒 Tài khoản riêng tư (Private Account)</span>
          </label>
        </div>

        <div class="form-group">
          <label>Website URL:</label>
          <input type="text" v-model="website" class="form-input" />
        </div>

        <!-- Custom Links Management -->
        <div class="form-group border-t border-gray-800 pt-3">
          <label class="flex justify-between items-center mb-2">
            <span>Danh sách liên kết (Profile Links):</span>
            <button @click="addLink" class="text-xs text-indigo-400 font-bold hover:underline">+ Thêm liên kết</button>
          </label>
          <div v-for="(link, idx) in links" :key="idx" class="flex gap-2 mb-2 items-center">
            <input type="text" v-model="link.title" placeholder="Tiêu đề (VD: GitHub)" class="w-1/3 form-input text-xs" />
            <input type="text" v-model="link.url" placeholder="https://..." class="flex-1 form-input text-xs" />
            <button @click="removeLink(idx)" class="text-gray-400 hover:text-red-400 p-1"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>

        <div class="form-group">
          <label>URL Ảnh Đại Diện (Avatar):</label>
          <input type="text" v-model="avatar" class="form-input" />
        </div>

        <div class="form-group">
          <label>URL Ảnh Bìa (Cover Banner):</label>
          <input type="text" v-model="cover" class="form-input" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-outline" @click="$emit('close')">Hủy</button>
        <button class="btn-primary" @click="save">Lưu Thay Đổi</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const emit = defineEmits(['close'])
const store = useThreadsStore()

const displayName = ref(store.currentUser.display_name)
const bio = ref(store.currentUser.bio)
const website = ref(store.currentUser.website)
const avatar = ref(store.currentUser.avatar)
const cover = ref(store.currentUser.cover)
const isPrivate = ref(store.currentUser.is_private || false)
const links = reactive(store.currentUser.links ? JSON.parse(JSON.stringify(store.currentUser.links)) : [])

function addLink() {
  links.push({ title: '', url: '' })
}

function removeLink(idx) {
  links.splice(idx, 1)
}

function save() {
  store.currentUser.display_name = displayName.value
  store.currentUser.bio = bio.value
  store.currentUser.website = website.value
  store.currentUser.avatar = avatar.value
  store.currentUser.cover = cover.value
  store.currentUser.is_private = isPrivate.value
  store.currentUser.links = links.filter(l => l.title.trim() && l.url.trim())
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
