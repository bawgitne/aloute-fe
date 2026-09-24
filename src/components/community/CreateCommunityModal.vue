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
  <div v-if="store.isCreateCommunityModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
    <div class="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col">
      <div class="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <h3 class="text-lg font-bold">Tạo Cộng Đồng Mới</h3>
        <button @click="handleClose" class="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tên Cộng Đồng</label>
          <input
            type="text"
            v-model="name"
            placeholder="Ví dụ: AI Innovators Club"
            class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Mô tả</label>
          <textarea
            v-model="description"
            rows="3"
            placeholder="Mô tả về quy tắc, chủ đề thảo luận của cộng đồng..."
            class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ảnh đại diện (Avatar URL)</label>
          <input
            type="text"
            v-model="avatar"
            placeholder="https://..."
            class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ảnh bìa (Cover URL)</label>
          <input
            type="text"
            v-model="cover"
            placeholder="https://..."
            class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div class="pt-2">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="isPrivate" class="w-4 h-4 rounded accent-indigo-500" />
            <span class="text-sm text-gray-300">Cộng đồng riêng tư (Cần duyệt thành viên)</span>
          </label>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50">
        <button @click="handleClose" class="px-4 py-2 text-sm text-gray-400 hover:text-white">Hủy</button>
        <button @click="handleCreate" class="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white shadow-lg">
          Tạo Cộng Đồng
        </button>
      </div>
    </div>
  </div>
</template>
