<template>
  <div v-if="post" class="comments-side-panel card-social">
    <!-- Panel Header with Reduced Spacing -->
    <div class="panel-header">
      <div class="header-left-info">
        <h3><i class="fa-regular fa-comments text-primary"></i> Comments</h3>
      </div>
      <button class="btn-icon btn-sm" @click="closePanel" title="Close Panel">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Main Comment Composer Input -->
    <div class="composer-box">
      <div class="input-wrapper">
        <img :src="currentUser.avatar" class="avatar avatar-sm" />
        <div class="input-relative">
          <input
            type="text"
            v-model="commentText"
            placeholder="Write a comment..."
            @keyup.enter="handleReply"
          />
          <button
            class="embed-send-btn"
            :disabled="!commentText.trim()"
            @click="handleReply"
            title="Send Comment"
          >
            <i class="fa-regular fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Facebook-Style Comments Stream (Stem Line Connected, Level 3 Branch Curve Only) -->
    <div class="comments-list-body">
      <div v-if="post.replies && post.replies.length" class="replies-stream">
        <div
          v-for="reply in post.replies"
          :key="reply.id"
          class="thread-comment-item"
          :class="`level-${getReplyLevel(reply)}`"
        >
          <!-- Branch Line ONLY for Level 3 (from Level 2 mother comment down to Level 3) -->
          <div
            v-if="getReplyLevel(reply) === 3"
            class="level3-branch-line"
          ></div>

          <!-- Avatar (Always Left-aligned) -->
          <div class="avatar-column">
            <img
              :src="reply.user.avatar"
              class="comment-avatar"
              :class="getReplyLevel(reply) === 0 ? 'avatar-md' : 'avatar-sm'"
            />
          </div>

          <!-- Main Content (Name, Username, Time, Text, Actions) -->
          <div class="comment-main-content">
            <div class="comment-header">
              <span class="author-name">{{ reply.user.name }}</span>
              <span class="author-handle">@{{ reply.user.username }}</span>
              <span class="comment-time">{{ reply.created_at }}</span>
            </div>

            <p class="comment-text">{{ reply.content }}</p>

            <div class="comment-actions">
              <button
                class="action-btn"
                :class="{ liked: reply.is_liked }"
                @click="toggleReplyLike(reply)"
              >
                <i :class="reply.is_liked ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
                <span>{{ reply.like_count }}</span>
              </button>

              <button
                class="action-btn"
                :class="{ active: activeInlineReplyId === reply.id }"
                @click="toggleInlineReply(reply.id)"
                title="Reply"
              >
                <i class="fa-regular fa-comment"></i>
                <span class="action-text">Trả lời</span>
              </button>
            </div>

            <!-- Inline Comment Input -->
            <div v-if="activeInlineReplyId === reply.id" class="inline-composer-box">
              <div class="input-relative">
                <input
                  type="text"
                  v-model="inlineReplyText"
                  :placeholder="`Reply to @${reply.user.username}...`"
                  @keyup.enter="handleInlineReplySubmit(reply)"
                  autofocus
                />
                <button
                  class="embed-send-btn"
                  :disabled="!inlineReplyText.trim()"
                  @click="handleInlineReplySubmit(reply)"
                  title="Send Reply"
                >
                  <i class="fa-regular fa-paper-plane"></i>
                </button>
              </div>
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
const activeInlineReplyId = ref(null)
const inlineReplyText = ref('')

function closePanel() {
  selectedPostForComments.value = null
}

function handleReply() {
  if (!commentText.value.trim() || !props.post) return
  const newReply = {
    id: `reply_${Date.now()}`,
    user_id: currentUser.id,
    user: {
      id: currentUser.id,
      name: currentUser.display_name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      is_verified: currentUser.is_verified
    },
    content: commentText.value.trim(),
    parent_post_id: props.post.id,
    parent_reply_id: null,
    level: 0,
    created_at: 'Just now',
    like_count: 0,
    is_liked: false
  }
  if (!props.post.replies) props.post.replies = []
  props.post.replies.push(newReply)
  props.post.reply_count++
  commentText.value = ''
}

function toggleReplyLike(reply) {
  reply.is_liked = !reply.is_liked
  if (reply.is_liked) reply.like_count++
  else reply.like_count--
}

function toggleInlineReply(replyId) {
  if (activeInlineReplyId.value === replyId) {
    activeInlineReplyId.value = null
  } else {
    activeInlineReplyId.value = replyId
    inlineReplyText.value = ''
  }
}

function getReplyLevel(reply) {
  if (reply.level !== undefined) return reply.level
  if (reply.content && reply.content.startsWith('@')) return 1
  return 0
}

function hasChildReplies(reply, index) {
  if (!props.post || !props.post.replies) return false
  if (index >= props.post.replies.length - 1) return false
  const currentLevel = getReplyLevel(reply)
  const nextLevel = getReplyLevel(props.post.replies[index + 1])
  return nextLevel > currentLevel
}

function isLastInGroup(index) {
  if (!props.post || !props.post.replies) return true
  if (index >= props.post.replies.length - 1) return true
  const currentLevel = getReplyLevel(props.post.replies[index])
  const nextLevel = getReplyLevel(props.post.replies[index + 1])
  return nextLevel < currentLevel
}

function handleInlineReplySubmit(parentReply) {
  if (!inlineReplyText.value.trim() || !props.post) return

  const parentLevel = getReplyLevel(parentReply)
  const nextLevel = Math.min(3, parentLevel + 1)

  const newReply = {
    id: `reply_${Date.now()}`,
    user_id: currentUser.id,
    user: {
      id: currentUser.id,
      name: currentUser.display_name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      is_verified: currentUser.is_verified
    },
    content: `@${parentReply.user.username} ${inlineReplyText.value.trim()}`,
    parent_post_id: props.post.id,
    parent_reply_id: parentReply.id,
    level: nextLevel,
    created_at: 'Just now',
    like_count: 0,
    is_liked: false
  }

  const parentIndex = props.post.replies.findIndex(r => r.id === parentReply.id)
  if (parentIndex >= 0) {
    props.post.replies.splice(parentIndex + 1, 0, newReply)
  } else {
    props.post.replies.push(newReply)
  }

  props.post.reply_count++
  inlineReplyText.value = ''
  activeInlineReplyId.value = null
}
</script>

<style scoped>
.comments-side-panel {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height) - 40px);
  position: sticky;
  top: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding: 10px 14px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 8px;
}

.panel-header h3 {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}

.composer-box {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-relative {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.input-relative input {
  width: 100%;
  padding: 7px 34px 7px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 12px;
  outline: none;
}

.input-relative input:focus {
  border-color: var(--primary-color);
}

.embed-send-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: var(--primary-color);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.embed-send-btn:disabled {
  color: var(--text-light);
  opacity: 0.4;
  cursor: not-allowed;
}

.embed-send-btn:not(:disabled):hover {
  color: var(--primary-hover);
  transform: translateY(-50%) scale(1.12);
}

.inline-composer-box {
  margin-top: 6px;
  padding-top: 2px;
}

.comments-list-body {
  flex: 1;
  overflow-y: auto;
}

.replies-stream {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.thread-comment-item {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
}

/* Level Indentation */
.thread-comment-item.level-0 {
  margin-left: 0;
}

.thread-comment-item.level-1 {
  margin-left: 24px;
}

.thread-comment-item.level-2 {
  margin-left: 44px;
}

.thread-comment-item.level-3 {
  margin-left: 64px;
}

/* Branch Line ONLY for Level 3 (Starts from Level 2 mother comment down to Level 3 avatar) */
.thread-comment-item.level-3 .level3-branch-line {
  position: absolute;
  left: -7px; /* Level 2 mother comment avatar line is at x = 57px (64 - 57 = 7px) */
  top: -14px; /* extends from Level 2 above */
  width: 9px; /* extends right to Level 3 avatar */
  height: 32px; /* total height down to curve into Level 3 avatar */
  border-left: 2px solid var(--border-color-darker);
  border-bottom: 2px solid var(--border-color-darker);
  border-bottom-left-radius: 6px;
  pointer-events: none;
}

.avatar-column {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
}

.comment-avatar {
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-avatar.avatar-md {
  width: 34px;
  height: 34px;
}

.comment-avatar.avatar-sm {
  width: 26px;
  height: 26px;
}

.comment-main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.author-name {
  font-weight: 700;
  font-size: 12px;
  color: var(--text-main);
}

.author-handle {
  font-size: 11px;
  color: var(--text-muted);
}

.comment-time {
  font-size: 10px;
  color: var(--text-light);
  margin-left: auto;
}

.comment-text {
  font-size: 12px;
  line-height: 1.35;
  color: var(--text-main);
  margin-bottom: 4px;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-btn:hover, .action-btn.active, .action-btn.liked {
  color: var(--primary-color);
}

.action-btn.liked {
  color: var(--danger-color);
}

.action-text {
  font-size: 11px;
  font-weight: 600;
}

.empty-comments-box {
  text-align: center;
  padding: 24px 10px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 28px;
  margin-bottom: 6px;
  color: var(--text-light);
}

.text-danger { color: var(--danger-color); }
</style>
