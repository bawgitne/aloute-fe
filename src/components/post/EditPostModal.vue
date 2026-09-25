<script setup>
import { ref, watch } from 'vue'
import { useThreadsStore } from '../../composables/useThreadsStore'

const store = useThreadsStore()

const content = ref('')
const allowReply = ref('EVERYONE')
const allowQuote = ref('EVERYONE')
const mediaType = ref('IMAGE')
const mediaUrl = ref('')

watch(() => store.editingPost, (newPost) => {
  if (newPost) {
    content.value = newPost.content || ''
    allowReply.value = (newPost.allow_reply || 'EVERYONE').toUpperCase()
    allowQuote.value = (newPost.allow_quote || 'EVERYONE').toUpperCase()
    mediaUrl.value = newPost.media?.[0]?.url || newPost.media_url || ''
    mediaType.value = newPost.media?.[0]?.type || newPost.media_type || 'IMAGE'
  }
}, { immediate: true })

const handleSave = () => {
  if (!content.value.trim() && !mediaUrl.value.trim()) return
  if (store.editingPost) {
    store.editPost(store.editingPost.id, content.value, {
      allow_reply: allowReply.value,
      allow_quote: allowQuote.value,
      media_url: mediaUrl.value,
      media_type: mediaType.value
    })
  }
}

const handleClose = () => {
  store.isEditPostModalOpen = false
  store.editingPost = null
}
</script>

<template>
  <div v-if="store.isEditPostModalOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content max-w-xl">
      <!-- Header -->
      <div class="modal-header">
        <h3><i class="fa-solid fa-pen-to-square text-primary"></i> Chỉnh sửa bài viết</h3>
        <button @click="handleClose" class="btn-icon btn-sm">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4 overflow-y-auto">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nội dung</label>
          <textarea
            v-model="content"
            rows="5"
            class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Bạn đang nghĩ gì?"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Đường dẫn Media (Tùy chọn)</label>
          <div class="flex gap-2 mb-2">
            <select v-model="mediaType" class="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
              <option value="IMAGE">Ảnh (IMAGE)</option>
              <option value="VIDEO">Video (.mp4/.webm)</option>
              <option value="GIF">GIF động</option>
            </select>
            <input
              type="text"
              v-model="mediaUrl"
              placeholder="https://example.com/media.mp4 hoặc .gif"
              class="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div v-if="mediaUrl" class="relative rounded-xl overflow-hidden border border-gray-800 max-h-48 flex items-center justify-center bg-black">
            <video v-if="mediaType === 'VIDEO'" :src="mediaUrl" controls class="max-h-48 max-w-full object-contain"></video>
            <img v-else :src="mediaUrl" class="max-h-48 max-w-full object-contain" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ai có thể trả lời</label>
            <select v-model="allowReply" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-500">
              <option value="EVERYONE">Mọi người</option>
              <option value="FOLLOWERS">Người bạn theo dõi / Theo dõi bạn</option>
              <option value="MENTIONED">Người được nhắc đến</option>
              <option value="NONE">Không ai</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ai có thể trích dẫn</label>
            <select v-model="allowQuote" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-500">
              <option value="EVERYONE">Mọi người</option>
              <option value="FOLLOWERS">Người bạn theo dõi / Theo dõi bạn</option>
              <option value="NONE">Không ai</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50">
        <button
          @click="handleClose"
          class="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          Hủy
        </button>
        <button
          @click="handleSave"
          class="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  </div>
</template>
