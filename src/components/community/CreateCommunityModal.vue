<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '../../composables/useThreadsStore'

const store = useThreadsStore()

const name = ref('')
const description = ref('')
const avatar = ref('')
const cover = ref('')
const isPrivate = ref(false)

const handleCreate = () => {
  if (!name.value.trim()) return
  store.createCommunity({
    name: name.value,
    description: description.value,
    avatar: avatar.value || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
    cover: cover.value || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    is_private: isPrivate.value
  })
}

const handleClose = () => {
  store.isCreateCommunityModalOpen = false
}
</script>

<template>
  <div v-if="store.isCreateCommunityModalOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content max-w-lg">
      <div class="modal-header">
        <h3><i class="fa-solid fa-users-rectangle text-primary"></i> Tạo Cộng Đồng Mới</h3>
        <button class="btn-icon btn-sm" @click="handleClose"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="modal-body space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tên Cộng Đồng</label>
          <input
            type="text"
            v-model="name"
            placeholder="Ví dụ: AI Innovators Club"
            class="form-input"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Mô tả</label>
          <textarea
            v-model="description"
            rows="3"
            placeholder="Mô tả về quy tắc, chủ đề thảo luận của cộng đồng..."
            class="form-input"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ảnh đại diện (Avatar URL)</label>
          <input
            type="text"
            v-model="avatar"
            placeholder="https://..."
            class="form-input"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ảnh bìa (Cover URL)</label>
          <input
            type="text"
            v-model="cover"
            placeholder="https://..."
            class="form-input"
          />
        </div>

        <div class="pt-2">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="isPrivate" class="w-4 h-4 rounded accent-indigo-500" />
            <span class="text-sm text-gray-300">Cộng đồng riêng tư (Cần duyệt thành viên)</span>
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="handleClose" class="btn-outline">Hủy</button>
        <button @click="handleCreate" class="btn-primary">
          Tạo Cộng Đồng
        </button>
      </div>
    </div>
  </div>
</template>
