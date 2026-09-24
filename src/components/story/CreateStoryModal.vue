<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '../../composables/useThreadsStore'

const store = useThreadsStore()

const mediaUrl = ref('')
const mediaType = ref('IMAGE')
const caption = ref('')

const handleCreateStory = () => {
  if (!mediaUrl.value && !caption.value) return
  store.createStory({
    media_url: mediaUrl.value || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    media_type: mediaType.value,
    caption: caption.value
  })
}

const handleClose = () => {
  store.isCreateStoryModalOpen = false
}
</script>

<template>
  <div v-if="store.isCreateStoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
    <div class="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col">
      <div class="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <h3 class="text-lg font-bold">Tạo Tin (Story) mới</h3>
        <button @click="handleClose" class="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-1">Loại Media</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="radio" v-model="mediaType" value="IMAGE" class="accent-indigo-500" />
              Hình ảnh
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="radio" v-model="mediaType" value="VIDEO" class="accent-indigo-500" />
              Video (.mp4)
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-1">URL Media (Ảnh / Video)</label>
          <input
            type="text"
            v-model="mediaUrl"
            placeholder="https://images.unsplash.com/..."
            class="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-1">Chú thích (Caption)</label>
          <input
            type="text"
            v-model="caption"
            placeholder="Một ngày tuyệt vời ✨"
            class="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <!-- Preview -->
        <div v-if="mediaUrl" class="h-48 rounded-xl border border-gray-800 overflow-hidden bg-black flex items-center justify-center relative">
          <video v-if="mediaType === 'VIDEO'" :src="mediaUrl" controls class="max-h-full max-w-full object-contain"></video>
          <img v-else :src="mediaUrl" class="max-h-full max-w-full object-cover w-full h-full" />
          <div v-if="caption" class="absolute bottom-2 left-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white text-center">
            {{ caption }}
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50">
        <button @click="handleClose" class="px-4 py-2 text-sm text-gray-400 hover:text-white">Hủy</button>
        <button @click="handleCreateStory" class="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white shadow-lg">
          Đăng Tin
        </button>
      </div>
    </div>
  </div>
</template>
