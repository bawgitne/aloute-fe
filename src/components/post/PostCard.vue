<template>
  <article
    ref="cardRef"
    class="card-social post-card"
    :class="{ 'active-comment-post': store.selectedPostForComments && store.selectedPostForComments.id === post.id }"
    v-if="!isPostHidden"
    @click="selectPostForComments"
  >
    <!-- Post Top Header -->
    <div class="post-header">
      <div class="author-info" @click.stop="openProfile">
        <img :src="post.user.avatar" class="avatar avatar-md" />
        <div class="author-details">
          <div class="author-title">
            <span class="author-name">{{ post.user.display_name || post.user.name }}</span>
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
          <!-- Edit Post (Author only) -->
          <button v-if="isAuthor" class="menu-dropdown-item text-indigo-400" @click="triggerEdit">
            <i class="fa-solid fa-pen-to-square"></i> Chỉnh sửa bài viết
          </button>
          <!-- Delete Post (Author only) -->
          <button v-if="isAuthor" class="menu-dropdown-item text-danger" @click="triggerDelete">
            <i class="fa-solid fa-trash"></i> Xóa bài viết
          </button>

          <!-- Hide Post -->
          <button class="menu-dropdown-item" @click="triggerHide">
            <i class="fa-solid fa-eye-slash"></i> Ẩn bài viết
          </button>

          <!-- Restrict User (Non-author) -->
          <button v-if="!isAuthor" class="menu-dropdown-item text-amber-400" @click="triggerRestrict">
            <i class="fa-solid fa-user-slash"></i> Hạn chế @{{ post.user.username }}
          </button>

          <!-- Report Post -->
          <button class="menu-dropdown-item text-danger" @click="triggerReport">
            <i class="fa-solid fa-flag"></i> Báo cáo bài viết
          </button>
        </div>
      </div>
    </div>

    <!-- Post Body Content -->
    <div class="post-body">
      <!-- Formatted Post Text with parsed Mentions and Hashtags -->
      <div class="post-text whitespace-pre-wrap" v-html="formattedContent" @click="handleTextClick"></div>

      <!-- Topic Tags -->
      <div v-if="post.topics && post.topics.length" class="topic-tags">
        <span
          v-for="t in post.topics"
          :key="t"
          class="topic-tag cursor-pointer hover:underline"
          @click.stop="selectTopic(t)"
        >
          #{{ t }}
        </span>
      </div>

      <!-- Media Attachments (Image, Video, GIF) -->
      <div v-if="post.media && post.media.length" class="post-media-grid">
        <div v-for="m in post.media" :key="m.id || m.url" class="media-item overflow-hidden rounded-xl bg-black border border-gray-800">
          <video v-if="m.type === 'VIDEO' || isVideoUrl(m.url)" controls :src="m.url" class="w-full max-h-[400px] object-contain" @click.stop></video>
          <div v-else class="relative group">
            <img :src="m.url" class="media-img w-full max-h-[450px] object-cover" />
            <span v-if="m.type === 'GIF' || m.url.endsWith('.gif')" class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white tracking-widest uppercase">
              GIF
            </span>
          </div>
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
          @click="store.toggleLikePost(post)"
          title="Like"
        >
          <i :class="post.is_liked ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
          <span>{{ post.like_count }}</span>
        </button>

        <!-- Reply / Comments Action -->
        <button
          class="btn-action"
          :class="{ active: store.selectedPostForComments && store.selectedPostForComments.id === post.id, 'opacity-50 cursor-not-allowed': !canReply }"
          :disabled="!canReply"
          @click="selectPostForComments"
          :title="canReply ? 'Mở bình luận' : 'Tác giả tắt bình luận'"
        >
          <i class="fa-regular fa-comment"></i>
          <span>{{ post.reply_count }}</span>
        </button>

        <!-- Repost Action -->
        <button
          class="btn-action"
          :class="{ active: post.is_reposted }"
          @click="store.toggleRepost(post)"
          title="Repost"
        >
          <i :class="post.is_reposted ? 'fa-solid fa-retweet text-success' : 'fa-solid fa-retweet'"></i>
          <span>{{ post.repost_count }}</span>
        </button>

        <!-- Quote Action (Real Quote Post) -->
        <button
          class="btn-action"
          :class="{ 'opacity-50 cursor-not-allowed': !canQuote }"
          :disabled="!canQuote"
          @click="openQuoteComposer"
          :title="canQuote ? 'Trích dẫn bài viết' : 'Tác giả tắt trích dẫn'"
        >
          <i class="fa-solid fa-quote-left"></i>
          <span>{{ post.quote_count }}</span>
        </button>

        <!-- Bookmark Action -->
        <button
          class="btn-action"
          :class="{ active: post.is_bookmarked }"
          @click="store.toggleBookmark(post)"
          title="Bookmark"
        >
          <i :class="post.is_bookmarked ? 'fa-solid fa-bookmark text-primary' : 'fa-regular fa-bookmark'"></i>
        </button>
      </div>

      <div class="post-stats-right">
        <!-- Views & Link Clicks Analytics -->
        <button class="btn-analytics" @click="openAnalytics" title="Xem phân tích bài viết">
          <i class="fa-solid fa-chart-simple"></i>
          <span>{{ post.view_count }} lượt xem</span>
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

const store = useThreadsStore()

const cardRef = ref(null)
const showMenu = ref(false)

const isAuthor = computed(() => {
  return props.post.user_id === store.currentUser.id || props.post.user?.username === store.currentUser.username
})

const isPostHidden = computed(() => store.moderation.hiddenPosts.includes(props.post.id))

const canReply = computed(() => {
  const perm = (props.post.allow_reply || 'EVERYONE').toUpperCase()
  if (perm === 'NONE') return isAuthor.value
  if (perm === 'EVERYONE') return true
  if (perm === 'FOLLOWERS') {
    return isAuthor.value || props.post.user?.is_following || store.currentUser.following?.includes(props.post.user_id)
  }
  if (perm === 'MENTIONED') {
    return isAuthor.value || (props.post.content && props.post.content.includes('@' + store.currentUser.username))
  }
  return true
})

const canQuote = computed(() => {
  const perm = (props.post.allow_quote || 'EVERYONE').toUpperCase()
  if (perm === 'NONE') return isAuthor.value
  if (perm === 'EVERYONE') return true
  if (perm === 'FOLLOWERS') {
    return isAuthor.value || props.post.user?.is_following || store.currentUser.following?.includes(props.post.user_id)
  }
  return true
})

function handleTextClick(e) {
  const target = e.target
  if (target && target.tagName === 'SPAN' && target.dataset.mention) {
    e.stopPropagation()
    const username = target.dataset.mention
    const foundUser = store.users.find(u => u.username === username)
    if (foundUser) {
      store.selectedProfileUser = foundUser
      store.activeTab = 'profile'
    }
  }
}

// Mention and Hashtag parsing
const formattedContent = computed(() => {
  if (!props.post.content) return ''
  let text = props.post.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Parse @username into styled link with data-mention attribute
  text = text.replace(/@([a-zA-Z0-9_]+)/g, '<span data-mention="$1" class="text-indigo-400 font-semibold cursor-pointer hover:underline">@$1</span>')
  // Parse #hashtag into styled link
  text = text.replace(/#([a-zA-Z0-9_]+)/g, '<span class="text-purple-400 font-semibold cursor-pointer hover:underline">#$1</span>')

  return text
})

function isVideoUrl(url) {
  if (!url) return false
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('video')
}

function selectPostForComments() {
  if (!canReply.value) return
  store.selectedPostForComments = props.post
  if (store.commentDisplayMode === 'popup') {
    store.isPostDetailModalOpen = true
  } else {
    if (cardRef.value) {
      const parent = cardRef.value.closest('.home-view-layout')
      if (parent) {
        const cardRect = cardRef.value.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()
        const topOffset = cardRect.top - parentRect.top
        store.selectedPostOffsetTop = Math.max(0, topOffset)
      } else {
        store.selectedPostOffsetTop = cardRef.value.offsetTop || 0
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
  const matchUser = store.users.find(u => u.id === props.post.user_id) || props.post.user
  store.selectedProfileUser = matchUser
  store.activeTab = 'profile'
}

function selectTopic(name) {
  store.activeFeedFilter = `topic_${name}`
  store.activeTab = 'feed'
}

function triggerHide() {
  store.hidePost(props.post)
  showMenu.value = false
}

function triggerReport() {
  store.reportTargetItem = props.post
  store.isReportModalOpen = true
  showMenu.value = false
}

function triggerEdit() {
  store.editingPost = props.post
  store.isEditPostModalOpen = true
  showMenu.value = false
}

function triggerDelete() {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
    store.deletePost(props.post.id)
  }
  showMenu.value = false
}

function triggerRestrict() {
  store.restrictUser(props.post.user)
  showMenu.value = false
}

function openQuoteComposer() {
  if (!canQuote.value) return
  store.openCreatePostWithQuote(props.post)
}

function openAnalytics() {
  store.analyticsTargetPost = props.post
  store.isAnalyticsModalOpen = true
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
