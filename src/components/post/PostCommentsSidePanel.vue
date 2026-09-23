<template>
  <div v-if="post" class="comments-side-panel card-social">
    <!-- Panel Header -->
    <div class="panel-header">
      <div class="header-left-info">
        <h3><i class="fa-regular fa-comments text-primary"></i> Discussion Thread</h3>
        <small class="text-muted">Comments for {{ post.user.name }}'s post</small>
      </div>
      <button class="btn-icon btn-sm" @click="closePanel" title="Close Discussion Panel">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Target Post Snippet Box -->
    <div class="post-snippet-box">
      <div class="snippet-author">
        <img :src="post.user.avatar" class="avatar avatar-sm" />
        <strong>{{ post.user.name }}</strong>
        <small>@{{ post.user.username }}</small>
      </div>
      <p class="snippet-text">{{ post.content }}</p>
    </div>

    <!-- Quick Comment Composer Input -->
    <div class="composer-box">
      <div class="input-row">
        <img :src="currentUser.avatar" class="avatar avatar-sm" />
        <input
          type="text"
          v-model="commentText"
          placeholder="Post your reply to this thread..."
          @keyup.enter="handleReply"
        />
      </div>
      <div class="composer-actions">
        <button
          class="btn-primary btn-sm"
          :disabled="!commentText.trim()"
          @click="handleReply"
        >
          <i class="fa-solid fa-paper-plane"></i> Reply
        </button>
      </div>
    </div>

    <!-- Comments / Replies List -->
    <div class="comments-list-body">
      <h4 class="comments-title">
        Replies ({{ post.replies ? post.replies.length : 0 }})
      </h4>

      <div v-if="post.replies && post.replies.length" class="replies-stream">
        <div v-for="reply in post.replies" :key="reply.id" class="reply-card">
          <img :src="reply.user.avatar" class="avatar avatar-sm" />
          <div class="reply-card-body">
            <div class="reply-author-row">
              <strong>{{ reply.user.name }}</strong>
              <small>@{{ reply.user.username }} • {{ reply.created_at }}</small>
            </div>
            <p class="reply-content">{{ reply.content }}</p>

            <div class="reply-footer">
              <button
                class="btn-like-sm"
                :class="{ liked: reply.is_liked }"
                @click="toggleReplyLike(reply)"
              >
                <i :class="reply.is_liked ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
                <span>{{ reply.like_count }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-comments-box">
        <i class="fa-solid fa-comment-dots empty-icon"></i>
        <p>No comments yet. Start the conversation!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const props = defineProps({
  post: { type: Object, default: null }
})

const { currentUser, selectedPostForComments, addReply } = useThreadsStore()
const commentText = ref('')

function closePanel() {
  selectedPostForComments.value = null
}

function handleReply() {
  if (!commentText.value.trim() || !props.post) return
  addReply(props.post.id, commentText.value.trim())
  commentText.value = ''
}

function toggleReplyLike(reply) {
  reply.is_liked = !reply.is_liked
  if (reply.is_liked) reply.like_count++
  else reply.like_count--
}
</script>

<style scoped>
.comments-side-panel {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height) - 40px);
  position: sticky;
  top: calc(var(--header-height) + 20px);
  padding: 16px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 12px;
}

.panel-header h3 {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-snippet-box {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  margin-bottom: 12px;
}

.snippet-author {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.snippet-author strong {
  font-size: 12px;
}

.snippet-author small {
  color: var(--text-muted);
  font-size: 11px;
}

.snippet-text {
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-main);
}

.composer-box {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.input-row input {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 12px;
  outline: none;
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
}

.comments-list-body {
  flex: 1;
  overflow-y: auto;
}

.comments-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 10px;
  text-transform: uppercase;
}

.replies-stream {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reply-card {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: var(--bg-surface-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.reply-card-body {
  flex: 1;
}

.reply-author-row strong {
  font-size: 12px;
  margin-right: 4px;
}

.reply-author-row small {
  font-size: 10px;
  color: var(--text-muted);
}

.reply-content {
  font-size: 12px;
  line-height: 1.4;
  margin: 4px 0;
}

.btn-like-sm {
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-comments-box {
  text-align: center;
  padding: 30px 10px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
  color: var(--text-light);
}

.text-danger { color: var(--danger-color); }
</style>
