<template>
  <div class="custom-feeds-view space-y-6">
    <div class="card-social page-header">
      <div class="header-content">
        <div>
          <h2><i class="fa-solid fa-sliders text-primary"></i> Quản Lý Custom Feeds</h2>
          <p class="text-muted">Tạo và quản lý các luồng bài viết được lọc theo chủ đề và tác giả tùy chỉnh.</p>
        </div>
        <button class="btn-primary" @click="showModal = true">
          <i class="fa-solid fa-plus"></i> Tạo Feed Mới
        </button>
      </div>
    </div>

    <!-- User Custom Feeds List -->
    <div>
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Feeds Của Bạn</h3>
      <div class="feeds-grid">
        <div
          v-for="feed in store.customFeeds"
          :key="feed.id"
          class="card-social feed-card relative group"
        >
          <div class="feed-header">
            <h3>{{ feed.name }}</h3>
            <div class="flex items-center gap-2">
              <span class="badge badge-primary">Custom</span>
              <button @click="store.deleteCustomFeed(feed.id)" class="text-gray-400 hover:text-red-400 p-1" title="Xóa Feed">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <p class="feed-desc">{{ feed.description }}</p>

          <div class="feed-filters-preview">
            <div v-if="feed.topics && feed.topics.length" class="tags-group">
              <small>Topics:</small>
              <span v-for="t in feed.topics" :key="t" class="tag">#{{ t }}</span>
            </div>
            <div v-if="feed.users && feed.users.length" class="tags-group">
              <small>Users:</small>
              <span v-for="u in feed.users" :key="u" class="tag">@{{ u }}</span>
            </div>
          </div>

          <div class="feed-card-footer flex justify-between items-center">
            <button class="btn-primary btn-sm" @click="applyFeedFilter(feed)">
              <i class="fa-solid fa-play"></i> Mở Stream Bài Viết
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Public Feed Discovery Section -->
    <div class="pt-4 border-t border-gray-800">
      <h3 class="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <i class="fa-solid fa-compass"></i> Khám Phá Feeds Công Khai Đang Nổi
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="pFeed in publicDiscoveryFeeds" :key="pFeed.id" class="p-4 rounded-2xl bg-gray-900 border border-gray-800 flex justify-between items-center">
          <div>
            <h4 class="font-bold text-sm text-white">{{ pFeed.name }}</h4>
            <p class="text-xs text-gray-400 mt-0.5">{{ pFeed.description }}</p>
            <div class="flex gap-1.5 mt-2">
              <span v-for="t in pFeed.topics" :key="t" class="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">#{{ t }}</span>
            </div>
          </div>
          <button @click="savePublicFeed(pFeed)" class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-indigo-600 text-xs font-semibold text-white transition flex items-center gap-1 shrink-0">
            <i class="fa-solid fa-bookmark"></i> Thêm Feed
          </button>
        </div>
      </div>
    </div>

    <!-- Create Custom Feed Modal -->
    <CustomFeedModal v-if="showModal" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import CustomFeedModal from '@/components/feed/CustomFeedModal.vue'

const store = useThreadsStore()
const showModal = ref(false)

const publicDiscoveryFeeds = [
  { id: 'pub_1', name: '🤖 AI & Neural Nets', description: 'Cập nhật nghiên cứu LLM, ChatGPT, Gemini & Agentic Coding mới nhất', topics: ['ArtificialIntelligence', 'WebDev'] },
  { id: 'pub_2', name: '🎨 Design Systems & UIUX', description: 'Thảo luận Micro-interactions, Tailwind, Glassmorphism & UX Trends', topics: ['UIUXDesign'] },
  { id: 'pub_3', name: '⚡ Cloudflare & Edge Architecture', description: 'Workers, Durable Objects, D1 & Serverless Cloud Solutions', topics: ['Cloudflare', 'WebDev'] }
]

function applyFeedFilter(feed) {
  store.activeFeedFilter = feed.id
  store.activeTab = 'feed'
}

function savePublicFeed(pFeed) {
  store.createCustomFeed(pFeed.name, pFeed.description, pFeed.topics, [])
}
</script>

<style scoped>
.custom-feeds-view {
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
}

.feeds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.feed-card {
  display: flex;
  flex-direction: column;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.feed-header h3 {
  font-size: 16px;
  font-weight: 700;
}

.feed-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 12px;
  flex: 1;
}

.feed-filters-preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.tags-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.tags-group small {
  font-size: 11px;
  color: var(--text-light);
  font-weight: 700;
}

.tag {
  font-size: 11px;
  background: var(--bg-surface-secondary);
  color: var(--primary-color);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-weight: 600;
}

.feed-card-footer {
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}
</style>
