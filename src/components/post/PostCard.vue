<template>
  <article
    ref="cardRef"
    class="card-social post-card"
    :class="{ 'active-comment-post': selectedPostForComments && selectedPostForComments.id === post.id }"
    v-if="!isPostHidden"
    @click="selectPostForComments"
  >
    <!-- Post Top Header -->
    <div class="post-header">
      <div class="author-info" @click.stop="openProfile">
        <img :src="post.user.avatar" class="avatar avatar-md" />
        <div class="author-details">
          <div class="author-title">
            <span class="author-name">{{ post.user.name }}</span>
            <i v-if="post.user.is_verified" class="fa-solid fa-circle-check verified-icon"></i>
            <span class="author-username">@{{ post.user.username }}</span>
          </div>
          <div class="post-meta">
            <span class="post-time">{{ post.created_at }}</span>
            <span class="dot">•</span>
            <span class="badge badge-secondary visibility-badge">
              <i :class="getVisibilityIcon(post.visibility)"></i>
              {{ post.visibility }}
            </span>
            <span v-if="post.flair" class="badge" :style="{ backgroundColor: post.flair.color + '20', color: post.flair.color }">
              {{ post.flair.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Options Dropdown -->
      <div class="post-options-wrapper" @click.stop>
        <button class="btn-icon btn-sm" @click="toggleMenu" title="More Options">
          <i class="fa-solid fa-ellipsis"></i>
        </button>

        <div v-if="showMenu" class="post-menu-dropdown card-social">
          <button class="menu-dropdown-item" @click="triggerHide">
            <i class="fa-solid fa-eye-slash"></i> Hide Post
          </button>
          <button class="menu-dropdown-item text-danger" @click="triggerReport">
            <i class="fa-solid fa-flag"></i> Report Post
          </button>
        </div>
      </div>
    </div>

    <!-- Post Body Content -->
    <div class="post-body">
      <p class="post-text">{{ post.content }}</p>

      <!-- Topic Tags -->
      <div v-if="post.topics && post.topics.length" class="topic-tags">
        <span
          v-for="t in post.topics"
          :key="t"
          class="topic-tag"
          @click.stop="selectTopic(t)"
        >
          #{{ t }}
        </span>
      </div>

      <!-- Media Attachments -->
      <div v-if="post.media && post.media.length" class="post-media-grid">
        <div v-for="m in post.media" :key="m.id" class="media-item">
          <img :src="m.url" class="media-img" />
        </div>
      </div>

      <!-- Interactive Poll Widget -->
      <PollWidget v-if="post.poll" :post="post" @click.stop />

      <!-- Embedded Quoted Post -->
      <QuoteCard
        v-if="post.quoted_post_id || post.quoted_post"
        :quotedPostId="post.quoted_post_id || ''"
        :quotedPostData="post.quoted_post"
        @click.stop
      />
    </div>

    <!-- Post Action Footer -->
    <div class="post-footer" @click.stop>
      <div class="post-actions">
        <!-- Like Action -->
        <button
          class="btn-action"
          :class="{ active: post.is_liked }"
          @click="toggleLikePost(post)"
          title="Like"
        >
          <i :class="post.is_liked ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
          <span>{{ post.like_count }}</span>
        </button>

        <!-- Reply / Comments Side Panel Action -->
        <button
          class="btn-action"
          :class="{ active: selectedPostForComments && selectedPostForComments.id === post.id }"
          @click="selectPostForComments"
          title="Open Comments Side-Panel"
        >
          <i class="fa-regular fa-comment"></i>
          <span>{{ post.reply_count }}</span>
        </button>

        <!-- Repost Action -->
        <button
          class="btn-action"
          :class="{ active: post.is_reposted }"
          @click="toggleRepost(post)"
          title="Repost"
        >
          <i :class="post.is_reposted ? 'fa-solid fa-retweet text-success' : 'fa-solid fa-retweet'"></i>
          <span>{{ post.repost_count }}</span>
        </button>

        <!-- Quote Action -->
        <button
          class="btn-action"
          @click="openQuoteComposer"
          title="Quote Post"
        >
          <i class="fa-solid fa-quote-left"></i>
          <span>{{ post.quote_count }}</span>
        </button>

        <!-- Bookmark Action -->
        <button
          class="btn-action"
          :class="{ active: post.is_bookmarked }"
          @click="toggleBookmark(post)"
          title="Bookmark"
        >
          <i :class="post.is_bookmarked ? 'fa-solid fa-bookmark text-primary' : 'fa-regular fa-bookmark'"></i>
        </button>
      </div>

      <div class="post-stats-right">
        <!-- Views & Link Clicks Analytics -->
        <button class="btn-analytics" @click="openAnalytics" title="View Post Analytics">
          <i class="fa-solid fa-chart-simple"></i>
          <span>{{ post.view_count }} views</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import PollWidget from './PollWidget.vue'
import QuoteCard from './QuoteCard.vue'

const props = defineProps({
  post: { type: Object, required: true }
})

const {
  users,
  moderation,
  activeTab,
  activeFeedFilter,
  selectedProfileUser,
  selectedPostForComments,
  selectedPostOffsetTop,
  commentDisplayMode,
  isPostDetailModalOpen,
  isCreatePostModalOpen,
  isReportModalOpen,
  reportTargetItem,
  isAnalyticsModalOpen,
  analyticsTargetPost,
  toggleLikePost,
  toggleRepost,
  toggleBookmark,
  hidePost
} = useThreadsStore()

const cardRef = ref(null)
const showMenu = ref(false)

const isPostHidden = computed(() => moderation.hiddenPosts.includes(props.post.id))

function selectPostForComments() {
  selectedPostForComments.value = props.post
  if (commentDisplayMode.value === 'popup') {
    isPostDetailModalOpen.value = true
  } else {
    if (cardRef.value) {
      const parent = cardRef.value.closest('.home-view-layout')
      if (parent) {
        const cardRect = cardRef.value.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()
        const topOffset = cardRect.top - parentRect.top
        selectedPostOffsetTop.value = Math.max(0, topOffset)
      } else {
        selectedPostOffsetTop.value = cardRef.value.offsetTop || 0
      }
    }
  }
}

function getVisibilityIcon(v) {
  if (v === 'FOLLOWERS') return 'fa-solid fa-user-group'
  if (v === 'MENTIONED') return 'fa-solid fa-at'
  return 'fa-solid fa-globe'
}

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function openProfile() {
  const matchUser = users.find(u => u.id === props.post.user_id) || props.post.user
  selectedProfileUser.value = matchUser
  activeTab.value = 'profile'
}

function selectTopic(name) {
  activeFeedFilter.value = `topic_${name}`
  activeTab.value = 'feed'
}

function triggerHide() {
  hidePost(props.post)
  showMenu.value = false
}

function triggerReport() {
  reportTargetItem.value = props.post
  isReportModalOpen.value = true
  showMenu.value = false
}

function openQuoteComposer() {
  isCreatePostModalOpen.value = true
}

function openAnalytics() {
  analyticsTargetPost.value = props.post
  isAnalyticsModalOpen.value = true
}
</script>

<style scoped>
.post-card {
  position: relative;
  margin-bottom: 16px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.post-card.active-comment-post {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(80, 181, 255, 0.25);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-name {
  font-weight: 700;
  font-size: 14px;
}

.verified-icon {
  color: var(--primary-color);
  font-size: 12px;
}

.author-username {
  color: var(--text-muted);
  font-size: 12px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.post-time {
  font-size: 11px;
  color: var(--text-light);
}

.dot {
  font-size: 10px;
  color: var(--text-light);
}

.visibility-badge {
  font-size: 10px;
  text-transform: uppercase;
}

.post-options-wrapper {
  position: relative;
}

.post-menu-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  width: 160px;
  padding: 6px;
  z-index: 50;
  box-shadow: var(--shadow-md);
}

.menu-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
}

.menu-dropdown-item:hover {
  background: var(--bg-surface-secondary);
}

.menu-dropdown-item.text-danger {
  color: var(--danger-color);
}

.post-body {
  margin-bottom: 12px;
}

.post-text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-main);
  margin-bottom: 10px;
  white-space: pre-line;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.topic-tag {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 11px;
  background: rgba(80, 181, 255, 0.08);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}

.post-media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin: 10px 0;
}

.media-img {
  width: 100%;
  max-height: 340px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.btn-action:hover, .btn-action.active {
  color: var(--primary-color);
}

.btn-analytics {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-light);
  font-weight: 600;
}

.text-danger { color: var(--danger-color); }
.text-success { color: var(--success-color); }
.text-primary { color: var(--primary-color); }
</style>
