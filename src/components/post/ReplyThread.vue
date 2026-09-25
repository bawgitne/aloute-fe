<template>
  <div class="replies-wrapper">
    <!-- Quick Reply Form -->
    <div class="quick-reply-box">
      <img :src="store.currentUser.avatar" class="avatar avatar-sm" />
      <input
        type="text"
        v-model="replyText"
        placeholder="Reply to this thread..."
        @keyup.enter="submitReply"
      />
      <button
        class="btn-primary btn-sm"
        :disabled="!replyText.trim()"
        @click="submitReply"
      >
        Reply
      </button>
    </div>

    <!-- Nested Replies List -->
    <div v-if="replies && replies.length" class="replies-list">
      <div v-for="reply in replies" :key="reply.id" class="reply-item">
        <div class="reply-thread-line"></div>
        <img :src="reply.user.avatar" class="avatar avatar-sm" />
        <div class="reply-body">
          <div class="reply-header">
            <strong>{{ reply.user.name }}</strong>
            <span class="user-handle">@{{ reply.user.username }}</span>
            <span class="dot-separator">•</span>
            <small class="reply-time">{{ reply.created_at }}</small>
          </div>
          <div class="reply-text">{{ reply.content }}</div>
          <div class="reply-actions">
            <button
              class="btn-action-sm"
              :class="{ liked: reply.is_liked }"
              @click="toggleReplyLike(reply)"
            >
              <i :class="reply.is_liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              <span>{{ reply.like_count }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const props = defineProps({
  postId: { type: String, required: true },
  replies: { type: Array, default: () => [] }
})

const store = useThreadsStore()
const replyText = ref('')

function submitReply() {
  if (!replyText.value.trim()) return
  store.addReply(props.postId, replyText.value.trim())
  replyText.value = ''
}

function toggleReplyLike(reply) {
  reply.is_liked = !reply.is_liked
  if (reply.is_liked) reply.like_count++
  else reply.like_count--
}
</script>

<style scoped>
.replies-wrapper {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
}

.quick-reply-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.quick-reply-box input {
  flex: 1;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 13px;
  outline: none;
}

.quick-reply-box input:focus {
  border-color: var(--primary-color);
}

.btn-sm {
  padding: 6px 14px;
  font-size: 12px;
}

.replies-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left: 14px;
  padding-left: 14px;
  border-left: 2px solid var(--border-color-darker);
}

.reply-item {
  position: relative;
  display: flex;
  gap: 10px;
}

.reply-body {
  flex: 1;
  background: var(--bg-surface-secondary);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.reply-header strong {
  font-size: 12px;
  font-weight: 700;
}

.user-handle {
  font-size: 11px;
  color: var(--text-muted);
}

.dot-separator {
  color: var(--text-light);
  font-size: 10px;
}

.reply-time {
  font-size: 10px;
  color: var(--text-light);
}

.reply-text {
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 6px;
}

.reply-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-action-sm {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.btn-action-sm.liked {
  color: var(--danger-color);
}
</style>
