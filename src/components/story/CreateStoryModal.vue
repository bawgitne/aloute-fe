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
  <div v-if="store.isCreateStoryModalOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content max-w-md">
      <div class="modal-header">
        <h3><i class="fa-solid fa-circle-plus text-primary"></i> Tạo Tin (Story) mới</h3>
        <button @click="handleClose" class="btn-icon btn-sm">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="modal-body space-y-4">
        <div>
          <label class="block text-xs font-semibold text-muted mb-1">Loại Media</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" v-model="mediaType" value="IMAGE" />
              Hình ảnh
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" v-model="mediaType" value="VIDEO" />
              Video (.mp4)
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-muted mb-1">URL Media (Ảnh / Video)</label>
          <input
            type="text"
            v-model="mediaUrl"
            placeholder="https://images.unsplash.com/..."
            class="form-input"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-muted mb-1">Chú thích (Caption)</label>
          <input
            type="text"
            v-model="caption"
            placeholder="Một ngày tuyệt vời ✨"
            class="form-input"
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

      <div class="modal-footer">
        <button @click="handleClose" class="btn-outline">Hủy</button>
        <button @click="handleCreateStory" class="btn-primary">
          Đăng Tin
        </button>
      </div>
    </div>
  </div>
</template>
