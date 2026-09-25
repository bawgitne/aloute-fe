<template>
  <div v-if="store.isCreatePostModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fa-solid fa-pen-to-square text-primary"></i> {{ store.quotedPostForCreate ? 'Trích dẫn bài viết' : store.targetCommunityForCreate ? `Đăng vào cộng đồng ${store.targetCommunityForCreate.name}` : 'Tạo bài viết mới' }}</h3>
        <button class="btn-icon btn-sm" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="modal-body">
        <!-- Target Community Badge -->
        <div v-if="store.targetCommunityForCreate" class="mb-3 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300 font-semibold">
          <div class="flex items-center gap-2">
            <img :src="store.targetCommunityForCreate?.avatar || defaultAvatar" class="w-5 h-5 rounded-full object-cover" />
            <span>Cộng đồng: {{ store.targetCommunityForCreate?.name }}</span>
          </div>
          <button @click="store.targetCommunityForCreate = null" class="text-gray-400 hover:text-white">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- User Info Header -->
        <div class="composer-user-info">
          <img :src="store.currentUser?.avatar || defaultAvatar" class="avatar avatar-md" />
          <div>
            <strong>{{ store.currentUser?.display_name || store.currentUser?.username || 'Người dùng' }}</strong>
            <div class="permission-controls">
              <!-- Visibility Selector -->
              <select v-model="visibility" class="select-sm">
                <option value="PUBLIC">🌐 Công khai</option>
                <option value="FOLLOWERS">👥 Người theo dõi</option>
                <option value="MENTIONED">💬 Nhắc đến</option>
              </select>
              <!-- Reply Permission Selector -->
              <select v-model="allowReply" class="select-sm">
                <option value="EVERYONE">Cho phép trả lời: Mọi người</option>
                <option value="FOLLOWERS">Cho phép trả lời: Theo dõi</option>
                <option value="NONE">Cho phép trả lời: Không ai</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Main Textarea -->
        <textarea
          v-model="content"
          placeholder="Bạn đang nghĩ gì? Thêm #chủđề hoặc @ngườidùng..."
          rows="4"
          class="composer-textarea"
        ></textarea>

        <!-- Quoted Post Preview Box -->
        <div v-if="store.quotedPostForCreate" class="relative my-3 p-3 rounded-xl bg-gray-950 border border-indigo-500/40 text-xs">
          <button @click="store.quotedPostForCreate = null" class="absolute top-2 right-2 p-1 text-gray-400 hover:text-white">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <div class="flex items-center gap-2 mb-1">
            <img :src="store.quotedPostForCreate?.user?.avatar || defaultAvatar" class="w-5 h-5 rounded-full object-cover" />
            <span class="font-bold text-white">{{ store.quotedPostForCreate?.user?.display_name || store.quotedPostForCreate?.user?.username }}</span>
            <span class="text-gray-400">@{{ store.quotedPostForCreate?.user?.username }}</span>
          </div>
          <p class="text-gray-300 line-clamp-2">{{ store.quotedPostForCreate?.content }}</p>
        </div>

        <!-- Media URL Input Box -->
        <div v-if="showMediaInput" class="p-3 my-2 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
          <div class="flex gap-2">
            <select v-model="customMediaType" class="select-sm bg-gray-900 border border-gray-700 text-white">
              <option value="IMAGE">Ảnh</option>
              <option value="VIDEO">Video (.mp4/.webm)</option>
              <option value="GIF">GIF</option>
            </select>
            <input
              type="text"
              v-model="customMediaUrl"
              placeholder="Nhập đường dẫn URL media..."
              class="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            />
            <button @click="addCustomMedia" class="px-3 py-1 bg-indigo-600 rounded-lg text-xs font-bold text-white">Thêm</button>
          </div>
        </div>

        <!-- Attached Media Preview -->
        <div v-if="mediaList.length" class="media-preview-container">
          <div v-for="(m, idx) in mediaList" :key="idx" class="media-preview-item">
            <video v-if="m.type === 'VIDEO'" :src="m.url" controls class="w-full max-h-36 object-contain"></video>
            <img v-else :src="m.url" />
            <button class="btn-remove-media" @click="removeMedia(idx)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Poll Builder Form -->
        <div v-if="showPollBuilder" class="poll-builder-card">
          <div class="poll-builder-header">
            <strong><i class="fa-solid fa-square-poll-vertical text-primary"></i> Tạo Khảo Sát</strong>
            <button class="btn-icon btn-sm" @click="showPollBuilder = false"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <input
            type="text"
            v-model="pollQuestion"
            placeholder="Đặt câu hỏi..."
            class="poll-input"
          />
          <div class="poll-builder-options">
            <div v-for="(opt, idx) in pollOptions" :key="idx" class="poll-option-row">
              <input
                type="text"
                v-model="pollOptions[idx]"
                :placeholder="`Lựa chọn ${idx + 1}`"
                class="poll-input"
              />
              <button v-if="pollOptions.length > 2" class="btn-icon btn-sm" @click="removePollOption(idx)">
                <i class="fa-solid fa-minus"></i>
              </button>
            </div>
          </div>
          <div class="poll-builder-footer">
            <button v-if="pollOptions.length < 5" class="btn-outline btn-sm" @click="addPollOption">
              <i class="fa-solid fa-plus"></i> Thêm Lựa Chọn
            </button>
            <label class="checkbox-label">
              <input type="checkbox" v-model="pollAllowMultiple" /> Cho phép chọn nhiều
            </label>
          </div>
        </div>

        <!-- Topic Tags Selector -->
        <div class="topic-picker">
          <span class="picker-label">Chủ đề:</span>
          <div class="topic-chips">
            <span
              v-for="topic in store.topics"
              :key="topic.id"
              class="chip"
              :class="{ selected: selectedTopics.includes(topic.name) }"
              @click="toggleTopicSelect(topic.name)"
            >
              #{{ topic.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Footer Toolbar & Publish Button -->
      <div class="modal-footer">
        <div class="composer-toolbar">
          <button class="btn-icon" @click="showMediaInput = !showMediaInput" title="Thêm Media URL">
            <i class="fa-solid fa-photo-film text-indigo-400"></i>
          </button>
          <button class="btn-icon" @click="addSampleImage" title="Ảnh mẫu">
            <i class="fa-solid fa-image text-success"></i>
          </button>
          <button class="btn-icon" @click="showPollBuilder = !showPollBuilder" title="Thêm Khảo Sát">
            <i class="fa-solid fa-chart-bar text-primary"></i>
          </button>
        </div>
        <button
          class="btn-primary"
          :disabled="!content.trim() && !mediaList.length && !pollQuestion.trim()"
          @click="submitPost"
        >
          <i class="fa-solid fa-paper-plane"></i> Đăng Bài
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const store = useThreadsStore()
const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'

const content = ref('')
const visibility = ref('PUBLIC')
const allowReply = ref('EVERYONE')
const selectedTopics = ref([])
const mediaList = ref([])

const showMediaInput = ref(false)
const customMediaUrl = ref('')
const customMediaType = ref('IMAGE')

// Poll state
const showPollBuilder = ref(false)
const pollQuestion = ref('')
const pollOptions = ref(['', ''])
const pollAllowMultiple = ref(false)

function closeModal() {
  store.isCreatePostModalOpen = false
  store.quotedPostForCreate = null
  store.targetCommunityForCreate = null
  resetForm()
}

function resetForm() {
  content.value = ''
  visibility.value = 'PUBLIC'
  allowReply.value = 'EVERYONE'
  selectedTopics.value = []
  mediaList.value = []
  showMediaInput.value = false
  customMediaUrl.value = ''
  showPollBuilder.value = false
  pollQuestion.value = ''
  pollOptions.value = ['', '']
  pollAllowMultiple.value = false
}

function toggleTopicSelect(name) {
  const idx = selectedTopics.value.indexOf(name)
  if (idx >= 0) selectedTopics.value.splice(idx, 1)
  else selectedTopics.value.push(name)
}

function addCustomMedia() {
  if (!customMediaUrl.value.trim()) return
  mediaList.value.push({
    id: `med_${Date.now()}`,
    type: customMediaType.value,
    url: customMediaUrl.value.trim()
  })
  customMediaUrl.value = ''
  showMediaInput.value = false
}

function addSampleImage() {
  const sampleImages = [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  ]
  const randomUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)]
  mediaList.value.push({ id: `med_${Date.now()}`, type: 'IMAGE', url: randomUrl })
}

function removeMedia(idx) {
  mediaList.value.splice(idx, 1)
}

function addPollOption() {
  pollOptions.value.push('')
}

function removePollOption(idx) {
  pollOptions.value.splice(idx, 1)
}

function submitPost() {
  let pollData = null
  if (showPollBuilder.value && pollQuestion.value.trim()) {
    const validOptions = pollOptions.value.filter(o => o.trim())
    if (validOptions.length >= 2) {
      pollData = {
        id: `poll_${Date.now()}`,
        question: pollQuestion.value.trim(),
        allow_multiple: pollAllowMultiple.value,
        total_votes: 0,
        user_voted_option_id: null,
        options: validOptions.map((text, i) => ({
          id: `opt_${Date.now()}_${i}`,
          text: text.trim(),
          vote_count: 0
        }))
      }
    }
  }

  store.createPost({
    content: content.value.trim(),
    visibility: visibility.value,
    allowReply: allowReply.value,
    topics: selectedTopics.value,
    media: mediaList.value,
    poll: pollData,
    community_id: store.targetCommunityForCreate ? store.targetCommunityForCreate.id : null,
    quoted_post_id: store.quotedPostForCreate ? store.quotedPostForCreate.id : null,
    quoted_post: store.quotedPostForCreate ? { ...store.quotedPostForCreate } : null
  })

  closeModal()
}
</script>

<style scoped>
.composer-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.permission-controls {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.select-sm {
  padding: 4px 8px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 11px;
  outline: none;
}

.composer-textarea {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  outline: none;
}

.composer-textarea:focus {
  border-color: var(--primary-color);
}

.media-preview-container {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  overflow-x: auto;
}

.media-preview-item {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.media-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-media {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.poll-builder-card {
  margin-top: 12px;
  padding: 12px;
  background: var(--bg-surface-secondary);
  border: 1px dashed var(--primary-color);
  border-radius: var(--radius-sm);
}

.poll-builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.poll-input {
  width: 100%;
  padding: 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface);
  color: var(--text-main);
  font-size: 13px;
  margin-bottom: 8px;
}

.poll-builder-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.poll-option-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.poll-builder-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.checkbox-label {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.topic-picker {
  margin-top: 14px;
}

.picker-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  display: block;
  margin-bottom: 6px;
}

.topic-chips {
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

.composer-toolbar {
  display: flex;
  gap: 8px;
}
</style>
