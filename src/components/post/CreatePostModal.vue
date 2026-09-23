<template>
  <div v-if="isCreatePostModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fa-solid fa-pen-to-square text-primary"></i> Create Thread</h3>
        <button class="btn-icon btn-sm" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="modal-body">
        <!-- User Info Header -->
        <div class="composer-user-info">
          <img :src="currentUser.avatar" class="avatar avatar-md" />
          <div>
            <strong>{{ currentUser.display_name }}</strong>
            <div class="permission-controls">
              <!-- Visibility Selector -->
              <select v-model="visibility" class="select-sm">
                <option value="PUBLIC">🌐 Public</option>
                <option value="FOLLOWERS">👥 Followers only</option>
                <option value="MENTIONED">💬 Mentioned users</option>
              </select>
              <!-- Reply Permission Selector -->
              <select v-model="allowReply" class="select-sm">
                <option value="EVERYONE">Can Reply: Everyone</option>
                <option value="FOLLOWERS">Can Reply: Followers</option>
                <option value="NONE">Can Reply: Nobody</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Main Textarea -->
        <textarea
          v-model="content"
          placeholder="What's on your mind? Use #topics or @mentions..."
          rows="4"
          class="composer-textarea"
        ></textarea>

        <!-- Attached Media Preview -->
        <div v-if="mediaList.length" class="media-preview-container">
          <div v-for="(m, idx) in mediaList" :key="idx" class="media-preview-item">
            <img :src="m.url" />
            <button class="btn-remove-media" @click="removeMedia(idx)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Poll Builder Form -->
        <div v-if="showPollBuilder" class="poll-builder-card">
          <div class="poll-builder-header">
            <strong><i class="fa-solid fa-square-poll-vertical text-primary"></i> Create Poll</strong>
            <button class="btn-icon btn-sm" @click="showPollBuilder = false"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <input
            type="text"
            v-model="pollQuestion"
            placeholder="Ask a question..."
            class="poll-input"
          />
          <div class="poll-builder-options">
            <div v-for="(opt, idx) in pollOptions" :key="idx" class="poll-option-row">
              <input
                type="text"
                v-model="pollOptions[idx]"
                :placeholder="`Option ${idx + 1}`"
                class="poll-input"
              />
              <button v-if="pollOptions.length > 2" class="btn-icon btn-sm" @click="removePollOption(idx)">
                <i class="fa-solid fa-minus"></i>
              </button>
            </div>
          </div>
          <div class="poll-builder-footer">
            <button v-if="pollOptions.length < 5" class="btn-outline btn-sm" @click="addPollOption">
              <i class="fa-solid fa-plus"></i> Add Option
            </button>
            <label class="checkbox-label">
              <input type="checkbox" v-model="pollAllowMultiple" /> Allow multiple answers
            </label>
          </div>
        </div>

        <!-- Topic Tags Selector -->
        <div class="topic-picker">
          <span class="picker-label">Topics:</span>
          <div class="topic-chips">
            <span
              v-for="topic in topics"
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
          <button class="btn-icon" @click="addSampleImage" title="Add Image">
            <i class="fa-solid fa-image text-success"></i>
          </button>
          <button class="btn-icon" @click="showPollBuilder = !showPollBuilder" title="Add Poll">
            <i class="fa-solid fa-chart-bar text-primary"></i>
          </button>
        </div>
        <button
          class="btn-primary"
          :disabled="!content.trim() && !mediaList.length && !pollQuestion.trim()"
          @click="submitPost"
        >
          <i class="fa-solid fa-paper-plane"></i> Publish Thread
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const {
  currentUser,
  topics,
  isCreatePostModalOpen,
  createPost
} = useThreadsStore()

const content = ref('')
const visibility = ref('PUBLIC')
const allowReply = ref('EVERYONE')
const selectedTopics = ref([])
const mediaList = ref([])

// Poll state
const showPollBuilder = ref(false)
const pollQuestion = ref('')
const pollOptions = ref(['', ''])
const pollAllowMultiple = ref(false)

function closeModal() {
  isCreatePostModalOpen.value = false
  resetForm()
}

function resetForm() {
  content.value = ''
  visibility.value = 'PUBLIC'
  allowReply.value = 'EVERYONE'
  selectedTopics.value = []
  mediaList.value = []
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

  createPost({
    content: content.value.trim(),
    visibility: visibility.value,
    allowReply: allowReply.value,
    topics: selectedTopics.value,
    media: mediaList.value,
    poll: pollData
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
