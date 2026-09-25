<template>
  <div class="topic-detail-view">
    <!-- Floating Topic Header directly on background -->
    <div class="topic-hero-header-floating">
      <div class="header-main-row flex items-center gap-3 flex-wrap">
        <h1 class="topic-big-title">#{{ topicName }}</h1>
        <span v-if="isTrending" class="badge-trending">
          <i class="fa-solid fa-fire text-amber-400"></i> Đang là xu hướng 🔥
        </span>
        <span v-else class="badge-topic-normal">
          <i class="fa-solid fa-hashtag text-indigo-400"></i> Chủ đề thảo luận
        </span>
      </div>

      <p class="topic-subtitle text-muted">
        Tất cả thảo luận và bài viết liên quan tới <strong class="text-indigo-400">#{{ topicName }}</strong>
      </p>

      <!-- Stats Metric Bar directly on background -->
      <div class="topic-stats-inline">
        <div class="stat-pill">
          <i class="fa-solid fa-newspaper text-indigo-400"></i>
          <strong>{{ totalPostCount }}</strong> bài viết
        </div>
        <div class="stat-pill">
          <i class="fa-solid fa-chart-line text-emerald-400"></i>
          <strong>{{ formatCount(totalInteractions) }}</strong> lượt quan tâm
        </div>
        <div class="stat-pill">
          <i class="fa-solid fa-eye text-amber-400"></i>
          <strong>{{ formatCount(totalViews) }}</strong> lượt xem
        </div>
      </div>
    </div>

    <!-- Feed Filter Bar -->
    <div class="card-social topic-filter-bar">
      <div class="flex gap-2 items-center">
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >
          <i class="fa-solid fa-fire"></i> Mới & Phổ biến
        </button>
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'popular' }"
          @click="activeFilter = 'popular'"
        >
          <i class="fa-solid fa-bolt"></i> Nhiều tương tác nhất
        </button>
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'media' }"
          @click="activeFilter = 'media'"
        >
          <i class="fa-solid fa-image"></i> Hình ảnh / Video
        </button>
      </div>
    </div>

    <!-- Topic Posts Feed Stream -->
    <div class="topic-posts-stream">
      <template v-for="post in filteredTopicPosts" :key="post.id">
        <PostCard :post="post" />
      </template>

      <!-- Empty State -->
      <div v-if="!filteredTopicPosts.length" class="card-social empty-topic-card">
        <i class="fa-solid fa-hashtag empty-icon"></i>
        <h3>Chưa có bài viết nào thuộc chủ đề #{{ topicName }}</h3>
        <p class="text-muted">Hãy là người đầu tiên đăng bài viết chứa thẻ <strong class="text-indigo-400">#{{ topicName }}</strong>!</p>
        <button
          @click="store.isCreatePostModalOpen = true"
          class="btn-primary px-4 py-2 rounded-xl text-xs font-bold mt-4"
        >
          <i class="fa-solid fa-plus"></i> Đăng bài đầu tiên
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThreadsStore } from '@/composables/useThreadsStore'
import PostCard from '@/components/post/PostCard.vue'

const props = defineProps({
  name: {
    type: String,
    required: false
  }
})

const route = useRoute()
const store = useThreadsStore()

const activeFilter = ref('all')

const topicName = computed(() => {
  return props.name || route.params.name || 'WebDev'
})

const matchedTopic = computed(() => {
  return store.topics.find(t => t.name.toLowerCase() === topicName.value.toLowerCase())
})

const isTrending = computed(() => {
  if (matchedTopic.value) return true
  return totalInteractions.value > 100
})

const topicPosts = computed(() => {
  const tName = topicName.value.toLowerCase()
  return store.posts.filter(p => {
    if (p.topics && p.topics.some(t => t.toLowerCase() === tName)) return true
    if (p.content && p.content.toLowerCase().includes(`#${tName}`)) return true
    return false
  })
})

const totalPostCount = computed(() => {
  const count = topicPosts.value.length
  if (matchedTopic.value && matchedTopic.value.post_count > count) {
    return matchedTopic.value.post_count
  }
  return count || 1
})

const totalInteractions = computed(() => {
  return topicPosts.value.reduce((acc, p) => {
    return acc + (p.like_count || 0) + (p.reply_count || 0) + (p.repost_count || 0) + (p.quote_count || 0)
  }, matchedTopic.value ? matchedTopic.value.post_count * 3 : 420)
})

const totalViews = computed(() => {
  return topicPosts.value.reduce((acc, p) => acc + (p.view_count || 0), 1250)
})

const filteredTopicPosts = computed(() => {
  let list = [...topicPosts.value]
  if (activeFilter.value === 'popular') {
    list.sort((a, b) => (b.like_count + b.reply_count) - (a.like_count + a.reply_count))
  } else if (activeFilter.value === 'media') {
    list = list.filter(p => p.media && p.media.length > 0)
  }
  return list
})

function formatCount(num) {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}
</script>

<style scoped>
.topic-detail-view {
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

.topic-hero-header-floating {
  padding: 8px 4px 18px 4px;
  margin-bottom: 8px;
}

.topic-big-title {
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.8px;
  color: var(--text-main);
  line-height: 1.1;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-trending {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #f59e0b;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.badge-topic-normal {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: rgba(80, 181, 255, 0.1);
  border: 1px solid var(--border-color);
  color: var(--primary-color);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.topic-subtitle {
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 12px;
  line-height: 1.4;
}

/* Stats Metric Pills */
.topic-stats-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-muted);
}

.stat-pill strong {
  color: var(--text-main);
  font-weight: 800;
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: var(--border-color);
}

.topic-filter-bar {
  padding: 8px 12px;
  margin-bottom: 16px;
}

.filter-pill {
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-pill.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.topic-posts-stream {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-topic-card {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 40px;
  color: var(--text-light);
  margin-bottom: 12px;
}
</style>
