<template>
  <div v-if="quotedPost" class="quote-card card-social">
    <div class="quote-header">
      <img :src="quotedUser.avatar || defaultAvatar" class="avatar avatar-sm" />
      <div class="quote-author">
        <strong>{{ quotedUser.name }}</strong>
        <small>@{{ quotedUser.username }}</small>
      </div>
    </div>
    <div class="quote-content">
      {{ quotedPost.content }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const props = defineProps({
  quotedPostId: { type: String, required: true },
  quotedPostData: { type: Object, default: null }
})

const store = useThreadsStore()

const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'

const quotedPost = computed(() => {
  if (props.quotedPostData) return props.quotedPostData
  return (store.posts || []).find(p => p.id === props.quotedPostId) || null
})

const quotedUser = computed(() => {
  if (!quotedPost.value) return { name: 'User', username: 'user' }
  return quotedPost.value.user || { name: 'User', username: 'user' }
})
</script>

<style scoped>
.quote-card {
  margin: 10px 0;
  padding: 12px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color-darker);
  border-radius: var(--radius-sm);
}

.quote-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.quote-author strong {
  font-size: 13px;
  font-weight: 700;
  margin-right: 4px;
}

.quote-author small {
  color: var(--text-muted);
  font-size: 11px;
}

.quote-content {
  font-size: 13px;
  color: var(--text-main);
  line-height: 1.4;
}
</style>
