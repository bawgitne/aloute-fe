<template>
  <transition name="modal-fade">
    <div
      v-if="isPostDetailModalOpen && selectedPostForComments"
      class="post-modal-backdrop"
      @click.self="closeModal"
    >
      <div class="ig-post-popup-modal card-social">
        <!-- Modal Top Close Action -->
        <button class="popup-close-btn" @click="closeModal" title="Close Modal (Esc)">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="modal-split-layout">
          <!-- LEFT COLUMN: Cloned Post Detail View -->
          <div class="post-detail-left">
            <!-- Author Header -->
            <div class="post-author-header">
              <img :src="selectedPostForComments.user.avatar" class="avatar avatar-md" />
              <div class="author-info">
                <div class="author-title">
                  <strong class="author-name">{{ selectedPostForComments.user.name }}</strong>
                  <i v-if="selectedPostForComments.user.is_verified" class="fa-solid fa-circle-check verified-icon"></i>
                  <span class="author-username">@{{ selectedPostForComments.user.username }}</span>
                </div>
                <span class="post-time">{{ selectedPostForComments.created_at }}</span>
              </div>
            </div>

            <!-- Main Post Body Content -->
            <div class="post-detail-body">
              <p class="post-text">{{ selectedPostForComments.content }}</p>

              <!-- Topic Hashtags -->
              <div v-if="selectedPostForComments.topics && selectedPostForComments.topics.length" class="topic-tags">
                <span v-for="t in selectedPostForComments.topics" :key="t" class="topic-tag">
                  #{{ t }}
                </span>
              </div>

              <!-- Media Attachments -->
              <div v-if="selectedPostForComments.media && selectedPostForComments.media.length" class="post-media-grid">
                <img
                  v-for="m in selectedPostForComments.media"
                  :key="m.id"
                  :src="m.url"
                  class="media-img"
                />
              </div>

              <!-- Interactive Poll Widget -->
              <PollWidget v-if="selectedPostForComments.poll" :post="selectedPostForComments" />

              <!-- Quoted Post -->
              <QuoteCard
                v-if="selectedPostForComments.quoted_post_id || selectedPostForComments.quoted_post"
                :quotedPostId="selectedPostForComments.quoted_post_id || ''"
                :quotedPostData="selectedPostForComments.quoted_post"
              />
            </div>

            <!-- Post Action Toolbar -->
            <div class="post-detail-footer">
              <div class="post-actions">
                <button
                  class="btn-action"
                  :class="{ active: selectedPostForComments.is_liked }"
                  @click="toggleLikePost(selectedPostForComments)"
                >
                  <i :class="selectedPostForComments.is_liked ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
                  <span>{{ selectedPostForComments.like_count }}</span>
                </button>

                <button
                  class="btn-action active"
                  title="Replies"
                >
                  <i class="fa-regular fa-comment"></i>
                  <span>{{ selectedPostForComments.reply_count }}</span>
                </button>

                <button
                  class="btn-action"
                  :class="{ active: selectedPostForComments.is_reposted }"
                  @click="toggleRepost(selectedPostForComments)"
                >
                  <i :class="selectedPostForComments.is_reposted ? 'fa-solid fa-retweet text-success' : 'fa-solid fa-retweet'"></i>
                  <span>{{ selectedPostForComments.repost_count }}</span>
                </button>

                <button
                  class="btn-action"
                  :class="{ active: selectedPostForComments.is_bookmarked }"
                  @click="toggleBookmark(selectedPostForComments)"
                >
                  <i :class="selectedPostForComments.is_bookmarked ? 'fa-solid fa-bookmark text-primary' : 'fa-regular fa-bookmark'"></i>
                </button>
              </div>

              <span class="views-count"><i class="fa-solid fa-chart-simple"></i> {{ selectedPostForComments.view_count }} views</span>
            </div>
          </div>

          <!-- RIGHT COLUMN: Comments Panel with Level 3 tree branches -->
          <div class="post-detail-right">
            <PostCommentsSidePanel :post="selectedPostForComments" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import PollWidget from './PollWidget.vue'
import QuoteCard from './QuoteCard.vue'
import PostCommentsSidePanel from './PostCommentsSidePanel.vue'

const {
  selectedPostForComments,
  isPostDetailModalOpen,
  toggleLikePost,
  toggleRepost,
  toggleBookmark
} = useThreadsStore()

function closeModal() {
  isPostDetailModalOpen.value = false
}

function handleKeydown(e) {
  if (e.key === 'Escape' && isPostDetailModalOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.post-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(6px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.ig-post-popup-modal {
  position: relative;
  width: 960px;
  max-width: 94vw;
  height: 84vh;
  max-height: 720px;
  border-radius: 18px;
  background: var(--bg-surface);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border-color-darker);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.popup-close-btn {
  position: absolute;
  top: 12px;
  right: 14px;
  z-index: 20;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.popup-close-btn:hover {
  transform: scale(1.1);
  background: var(--border-color);
}

.modal-split-layout {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Left Column: Post Content Detail */
.post-detail-left {
  flex: 1.1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.post-author-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.author-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-name {
  font-weight: 800;
  font-size: 15px;
}

.verified-icon {
  color: var(--primary-color);
  font-size: 13px;
}

.author-username {
  font-size: 13px;
  color: var(--text-muted);
}

.post-time {
  font-size: 11px;
  color: var(--text-light);
}

.post-detail-body {
  flex: 1;
  margin-bottom: 14px;
}

.post-text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-main);
  margin-bottom: 12px;
  white-space: pre-line;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.topic-tag {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 11px;
  background: rgba(80, 181, 255, 0.08);
  padding: 3px 10px;
  border-radius: var(--radius-pill);
}

.post-media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin: 12px 0;
}

.media-img {
  width: 100%;
  max-height: 380px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.post-detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
}

.btn-action:hover, .btn-action.active {
  color: var(--primary-color);
}

.views-count {
  font-size: 11px;
  color: var(--text-light);
}

/* Right Column: Comments Side Panel */
.post-detail-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
}

.post-detail-right :deep(.comments-side-panel) {
  height: 100%;
  border: none;
  box-shadow: none;
  border-radius: 0;
}

/* Modal Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.modal-fade-enter-active .ig-post-popup-modal,
.modal-fade-leave-active .ig-post-popup-modal {
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .ig-post-popup-modal,
.modal-fade-leave-to .ig-post-popup-modal {
  transform: scale(0.95) translateY(12px);
}

.text-danger { color: var(--danger-color); }
.text-success { color: var(--success-color); }
.text-primary { color: var(--primary-color); }

@media (max-width: 768px) {
  .modal-split-layout {
    flex-direction: column;
    overflow-y: auto;
  }
  .post-detail-left {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
