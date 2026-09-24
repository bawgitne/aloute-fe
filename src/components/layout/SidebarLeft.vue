<template>
  <aside class="sidebar-left">
    <!-- MODE 1: Left-Comments Mode (Frameless Pure Content with Dividers & Tight Spacing) -->
    <template v-if="commentDisplayMode === 'left_comments'">
      <div class="frameless-sidebar-content">
        <!-- Section 1: Profile Mini Card -->
        <div v-if="showMiniProfileCard" class="sidebar-section profile-section" @click="openProfile">
          <div class="mini-card-header">
            <img :src="currentUser.cover" class="mini-cover" />
            <img :src="currentUser.avatar" class="avatar avatar-lg mini-avatar" />
          </div>
          <div class="mini-card-body">
            <div class="user-name">
              {{ currentUser.display_name }}
              <i v-if="currentUser.is_verified" class="fa-solid fa-circle-check verified-icon"></i>
            </div>
            <div class="user-handle">@{{ currentUser.username }}</div>
            <div class="user-stats">
              <div class="stat-item">
                <strong>{{ currentUser.posts_count }}</strong>
                <span>Posts</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <strong>{{ currentUser.followers_count }}</strong>
                <span>Followers</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <strong>{{ currentUser.following_count }}</strong>
                <span>Following</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Line Divider 1 -->
        <div class="section-divider"></div>

        <!-- Section 2: Trending Hashtags / Topics -->
        <div class="sidebar-section topics-section">
          <div class="topics-list">
            <div
              v-for="topic in topics"
              :key="topic.id"
              class="topic-item"
              @click="selectTopic(topic.name)"
            >
              <div class="topic-info">
                <span class="topic-name">#{{ topic.name }}</span>
                <small class="topic-meta">{{ topic.post_count }} threads today</small>
              </div>
              <i class="fa-solid fa-chevron-right chevron-icon"></i>
            </div>
          </div>
        </div>

        <!-- Line Divider 2 -->
        <div class="section-divider"></div>

        <!-- Section 3: Joined Communities -->
        <div class="sidebar-section communities-section">
          <div class="communities-list">
            <div
              v-for="comm in joinedCommunities"
              :key="comm.id"
              class="community-item"
              @click="openCommunity(comm)"
            >
              <img :src="comm.avatar" class="avatar avatar-sm" />
              <div class="community-info">
                <strong>{{ comm.name }}</strong>
                <small>c/{{ comm.slug }}</small>
              </div>
            </div>
            <div v-if="!joinedCommunities.length" class="empty-small-text">
              No joined communities yet.
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODE 2: Standard Modes (Side Panel Right or Popup - 3 Separate Cards) -->
    <template v-else>
      <!-- Option Show/Hide Mini Profile Card -->
      <div v-if="showMiniProfileCard" class="card-social profile-mini-card" @click="openProfile">
        <div class="mini-card-header">
          <img :src="currentUser.cover" class="mini-cover" />
          <img :src="currentUser.avatar" class="avatar avatar-lg mini-avatar" />
        </div>
        <div class="mini-card-body">
          <div class="user-name">
            {{ currentUser.display_name }}
            <i v-if="currentUser.is_verified" class="fa-solid fa-circle-check verified-icon"></i>
          </div>
          <div class="user-handle">@{{ currentUser.username }}</div>
          <div class="user-stats">
            <div class="stat-item">
              <strong>{{ currentUser.posts_count }}</strong>
              <span>Posts</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <strong>{{ currentUser.followers_count }}</strong>
              <span>Followers</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <strong>{{ currentUser.following_count }}</strong>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trending Topics Widget Card -->
      <div class="card-social widget-card">
        <div class="widget-header">
          <h3><i class="fa-solid fa-fire text-warning"></i> Trending Topics</h3>
        </div>
        <div class="widget-body">
          <div
            v-for="topic in topics"
            :key="topic.id"
            class="topic-item"
            @click="selectTopic(topic.name)"
          >
            <div class="topic-info">
              <span class="topic-name">#{{ topic.name }}</span>
              <small class="topic-meta">{{ topic.post_count }} threads today</small>
            </div>
            <i class="fa-solid fa-chevron-right chevron-icon"></i>
          </div>
        </div>
      </div>

      <!-- Your Communities Widget Card -->
      <div class="card-social widget-card">
        <div class="widget-header">
          <h3><i class="fa-solid fa-users text-success"></i> Your Communities</h3>
          <button class="btn-link" @click="activeTab = 'communities'">All</button>
        </div>
        <div class="widget-body">
          <div
            v-for="comm in joinedCommunities"
            :key="comm.id"
            class="community-item"
            @click="openCommunity(comm)"
          >
            <img :src="comm.avatar" class="avatar avatar-sm" />
            <div class="community-info">
              <strong>{{ comm.name }}</strong>
              <small>c/{{ comm.slug }}</small>
            </div>
          </div>
          <div v-if="!joinedCommunities.length" class="empty-small-text">
            No joined communities yet.
          </div>
        </div>
      </div>
    </template>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const {
  currentUser,
  topics,
  communities,
  showMiniProfileCard,
  commentDisplayMode,
  activeTab,
  activeFeedFilter,
  selectedCommunity,
  selectedProfileUser
} = useThreadsStore()

const joinedCommunities = computed(() => communities.filter(c => c.is_joined))

function openProfile() {
  selectedProfileUser.value = currentUser
  activeTab.value = 'profile'
}

function selectTopic(name) {
  activeFeedFilter.value = `topic_${name}`
  activeTab.value = 'feed'
}

function openCommunity(comm) {
  selectedCommunity.value = comm
  activeTab.value = 'community_detail'
}
</script>

<style scoped>
.sidebar-left {
  width: var(--sidebar-width);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.frameless-sidebar-content {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-section {
  padding: 2px 0;
}

.profile-section {
  padding: 0;
  cursor: pointer;
}

.section-divider {
  height: 1px;
  background: var(--border-color);
  margin: 6px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.section-header h3 {
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mini-card-header {
  position: relative;
  height: 65px;
  overflow: visible;
}

.mini-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.mini-avatar {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  border: 3px solid var(--bg-main);
  box-shadow: var(--shadow-sm);
  z-index: 2;
}

.mini-card-body {
  padding: 24px 6px 4px 6px;
  text-align: center;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.verified-icon {
  color: var(--primary-color);
  font-size: 12px;
}

.user-handle {
  color: var(--text-muted);
  font-size: 11px;
  margin-bottom: 6px;
}

.user-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 6px;
  border-top: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item strong {
  font-size: 13px;
  color: var(--text-main);
}

.stat-item span {
  font-size: 10px;
  color: var(--text-muted);
}

.stat-divider {
  width: 1px;
  height: 20px;
  background: var(--border-color);
}

.widget-card {
  padding: 14px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-color);
}

.widget-header h3 {
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-link {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 600;
}

.widget-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.topic-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s ease;
}

.topic-item:hover {
  background: var(--bg-surface-secondary);
}

.topic-info {
  display: flex;
  flex-direction: column;
}

.topic-name {
  font-weight: 700;
  font-size: 12px;
  color: var(--text-main);
}

.topic-meta {
  font-size: 10px;
  color: var(--text-muted);
}

.chevron-icon {
  font-size: 10px;
  color: var(--text-light);
}

.community-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s ease;
}

.community-item:hover {
  background: var(--bg-surface-secondary);
}

.community-info strong {
  display: block;
  font-size: 12px;
  line-height: 1.2;
}

.community-info small {
  font-size: 10px;
  color: var(--primary-color);
}

.empty-small-text {
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
  padding: 6px 0;
}

.text-warning { color: var(--warning-color); }
.text-success { color: var(--success-color); }

@media (max-width: 900px) {
  .sidebar-left {
    display: none;
  }
}
</style>
