<template>
  <div class="custom-feeds-view">
    <div class="card-social page-header">
      <div class="header-content">
        <div>
          <h2><i class="fa-solid fa-sliders text-primary"></i> Custom Feeds Studio</h2>
          <p class="text-muted">Create custom timeline streams filtered by specific topic hashtags & usernames.</p>
        </div>
        <button class="btn-primary" @click="showModal = true">
          <i class="fa-solid fa-plus"></i> New Custom Feed
        </button>
      </div>
    </div>

    <!-- Feeds List -->
    <div class="feeds-grid">
      <div
        v-for="feed in customFeeds"
        :key="feed.id"
        class="card-social feed-card"
      >
        <div class="feed-header">
          <h3>{{ feed.name }}</h3>
          <span class="badge badge-primary">Custom</span>
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

        <div class="feed-card-footer">
          <button class="btn-primary btn-sm" @click="applyFeedFilter(feed)">
            <i class="fa-solid fa-play"></i> Open Feed Stream
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

const { customFeeds, activeFeedFilter, activeTab } = useThreadsStore()
const showModal = ref(false)

function applyFeedFilter(feed) {
  activeFeedFilter.value = feed.id
  activeTab.value = 'feed'
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
