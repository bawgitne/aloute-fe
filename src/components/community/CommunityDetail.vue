<template>
  <div v-if="community" class="community-detail-view">
    <!-- Header Banner -->
    <div class="card-social detail-header-card">
      <div class="detail-cover-wrapper">
        <img :src="community.cover" class="detail-cover" />
      </div>
      <div class="detail-header-body">
        <div class="detail-avatar-row">
          <img :src="community.avatar" class="avatar avatar-xl detail-avatar" />
          <div class="detail-action-buttons">
            <button
              class="btn-primary"
              :class="{ 'btn-outline': community.is_joined }"
              @click="toggleJoin"
            >
              {{ community.is_joined ? 'Joined Community' : 'Join Community' }}
            </button>
            <button class="btn-primary" @click="isCreatePostModalOpen = true">
              <i class="fa-solid fa-plus"></i> Post in {{ community.slug }}
            </button>
          </div>
        </div>

        <div class="detail-title-group">
          <h2>{{ community.name }}</h2>
          <span class="community-slug">c/{{ community.slug }}</span>
          <p class="community-description">{{ community.description }}</p>
        </div>

        <div class="detail-meta-counters">
          <div class="counter-item">
            <strong>{{ community.member_count }}</strong>
            <span>Members</span>
          </div>
          <div class="counter-divider"></div>
          <div class="counter-item">
            <strong>{{ community.post_count }}</strong>
            <span>Threads</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout: Main Content + Sidebar Widget -->
    <div class="community-content-layout">
      <div class="community-feed-column">
        <!-- Flair Filter Bar -->
        <div v-if="community.flairs && community.flairs.length" class="card-social flair-filter-card">
          <span class="flair-label"><i class="fa-solid fa-tags"></i> Filter by Flair:</span>
          <button
            class="flair-chip"
            :class="{ active: selectedFlair === null }"
            @click="selectedFlair = null"
          >
            All
          </button>
          <button
            v-for="flair in community.flairs"
            :key="flair.id"
            class="flair-chip"
            :class="{ active: selectedFlair === flair.id }"
            :style="{ borderColor: flair.color, color: selectedFlair === flair.id ? '#fff' : flair.color, backgroundColor: selectedFlair === flair.id ? flair.color : 'transparent' }"
            @click="selectedFlair = flair.id"
          >
            {{ flair.title }}
          </button>
        </div>

        <!-- Community Post Stream -->
        <div v-if="communityPosts.length">
          <PostCard
            v-for="post in communityPosts"
            :key="post.id"
            :post="post"
          />
        </div>
        <div v-else class="card-social empty-state">
          <i class="fa-solid fa-comments empty-icon"></i>
          <h4>No threads in this community yet</h4>
          <p>Be the first to create a post in {{ community.name }}!</p>
          <button class="btn-primary" @click="isCreatePostModalOpen = true">
            Create Thread
          </button>
        </div>
      </div>

      <!-- Right Sidebar: Champions & Rules -->
      <div class="community-sidebar-column">
        <!-- Champions Widget -->
        <div v-if="community.champions && community.champions.length" class="card-social widget-card">
          <div class="widget-header">
            <h3><i class="fa-solid fa-trophy text-warning"></i> Community Champions</h3>
          </div>
          <div class="widget-body">
            <div
              v-for="champ in community.champions"
              :key="champ.id"
              class="champion-item"
            >
              <i class="fa-solid fa-crown champion-icon"></i>
              <div>
                <strong>{{ champ.name }}</strong>
                <small class="badge badge-warning">{{ champ.role }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Guidelines Widget -->
        <div class="card-social widget-card">
          <div class="widget-header">
            <h3><i class="fa-solid fa-circle-info text-primary"></i> Rules</h3>
          </div>
          <ol class="rules-list">
            <li>Be respectful to all members.</li>
            <li>Use appropriate flairs for posts.</li>
            <li>No spam or self-promotional links.</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import PostCard from '@/components/post/PostCard.vue'

const {
  selectedCommunity,
  posts,
  isCreatePostModalOpen,
  joinCommunity,
  leaveCommunity
} = useThreadsStore()

const community = selectedCommunity
const selectedFlair = ref(null)

const communityPosts = computed(() => {
  if (!community.value) return []
  return posts.filter(p => {
    if (p.community_id !== community.value.id) return false
    if (selectedFlair.value && p.flair?.id !== selectedFlair.value) return false
    return true
  })
})

function toggleJoin() {
  if (community.value.is_joined) leaveCommunity(community.value)
  else joinCommunity(community.value)
}
</script>

<style scoped>
.detail-header-card {
  padding: 0;
  overflow: hidden;
  margin-bottom: 20px;
}

.detail-cover-wrapper {
  height: 160px;
}

.detail-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-header-body {
  padding: 0 24px 20px 24px;
}

.detail-avatar-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: -40px;
  margin-bottom: 16px;
}

.detail-avatar {
  border: 4px solid var(--bg-surface);
  box-shadow: var(--shadow-md);
}

.detail-action-buttons {
  display: flex;
  gap: 10px;
}

.detail-title-group h2 {
  font-size: 22px;
  font-weight: 800;
}

.community-slug {
  font-size: 13px;
  color: var(--primary-color);
  font-weight: 600;

}

.community-description {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.5;
}

.detail-meta-counters {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
}

.counter-item {
  display: flex;
  gap: 6px;
  align-items: center;
}

.counter-item strong {
  font-size: 15px;
  color: var(--text-main);
}

.counter-item span {
  font-size: 13px;
  color: var(--text-muted);
}

.counter-divider {
  width: 1px;
  height: 18px;
  background: var(--border-color);
}

.community-content-layout {
  display: flex;
  gap: 24px;
}

.community-feed-column {
  flex: 1;
  min-width: 0;
}

.community-sidebar-column {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.flair-filter-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
}

.flair-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  white-space: nowrap;
}

.flair-chip {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  font-size: 12px;
  font-weight: 600;
  background: transparent;
  color: var(--text-main);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.flair-chip.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 40px;
  color: var(--text-light);
  margin-bottom: 12px;
}

.champion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.champion-icon {
  color: var(--warning-color);
  font-size: 16px;
}

.rules-list {
  padding-left: 20px;
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 900px) {
  .community-content-layout {
    flex-direction: column;
  }
  .community-sidebar-column {
    width: 100%;
  }
}
</style>
