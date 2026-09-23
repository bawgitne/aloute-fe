<template>
  <aside class="sidebar-left">
    <!-- Mini User Profile Card -->
    <div class="card-social profile-mini-card" @click="openProfile">
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

    <!-- Navigation Menu List -->
    <div class="card-social menu-card">
      <nav class="sidebar-menu">
        <button
          class="menu-item"
          :class="{ active: activeTab === 'feed' }"
          @click="activeTab = 'feed'"
        >
          <i class="fa-solid fa-newspaper menu-icon"></i>
          <span class="menu-label">Home Feed</span>
        </button>

        <button
          class="menu-item"
          :class="{ active: activeTab === 'custom_feeds' }"
          @click="activeTab = 'custom_feeds'"
        >
          <i class="fa-solid fa-sliders menu-icon"></i>
          <span class="menu-label">Custom Feeds</span>
          <span class="badge badge-primary">{{ customFeeds.length }}</span>
        </button>

        <button
          class="menu-item"
          :class="{ active: activeTab === 'communities' }"
          @click="activeTab = 'communities'"
        >
          <i class="fa-solid fa-users-rectangle menu-icon"></i>
          <span class="menu-label">Communities</span>
          <span class="badge badge-success">{{ communities.length }}</span>
        </button>

        <button
          class="menu-item"
          :class="{ active: activeTab === 'messages' }"
          @click="activeTab = 'messages'"
        >
          <i class="fa-solid fa-comments menu-icon"></i>
          <span class="menu-label">Messages</span>
          <span v-if="unreadMessagesCount" class="badge badge-danger">{{ unreadMessagesCount }}</span>
        </button>

        <button
          class="menu-item"
          :class="{ active: activeTab === 'notifications' }"
          @click="activeTab = 'notifications'"
        >
          <i class="fa-solid fa-bell menu-icon"></i>
          <span class="menu-label">Notifications</span>
          <span v-if="unreadNotifsCount" class="badge badge-warning">{{ unreadNotifsCount }}</span>
        </button>

        <button
          class="menu-item"
          :class="{ active: activeTab === 'analytics' }"
          @click="activeTab = 'analytics'"
        >
          <i class="fa-solid fa-chart-line menu-icon"></i>
          <span class="menu-label">Post Analytics</span>
        </button>

        <button
          class="menu-item"
          :class="{ active: activeTab === 'moderation' }"
          @click="activeTab = 'moderation'"
        >
          <i class="fa-solid fa-shield-halved menu-icon"></i>
          <span class="menu-label">Safety & Reports</span>
        </button>

        <button
          class="menu-item"
          :class="{ active: activeTab === 'profile' }"
          @click="openProfile"
        >
          <i class="fa-solid fa-id-card menu-icon"></i>
          <span class="menu-label">My Profile</span>
        </button>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const {
  currentUser,
  customFeeds,
  communities,
  notifications,
  conversations,
  activeTab,
  selectedProfileUser
} = useThreadsStore()

const unreadNotifsCount = computed(() => notifications.filter(n => !n.is_read).length)
const unreadMessagesCount = computed(() => conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0))

function openProfile() {
  selectedProfileUser.value = currentUser
  activeTab.value = 'profile'
}
</script>

<style scoped>
.sidebar-left {
  width: var(--sidebar-width);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-mini-card {
  padding: 0;
  overflow: hidden;
  cursor: pointer;
}

.mini-card-header {
  position: relative;
  height: 70px;
}

.mini-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mini-avatar {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  border: 3px solid var(--bg-surface);
  box-shadow: var(--shadow-sm);
}

.mini-card-body {
  padding: 30px 16px 16px 16px;
  text-align: center;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.verified-icon {
  color: var(--primary-color);
  font-size: 13px;
}

.user-handle {
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 12px;
}

.user-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item strong {
  font-size: 14px;
  color: var(--text-main);
}

.stat-item span {
  font-size: 11px;
  color: var(--text-muted);
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: var(--border-color);
}

.menu-card {
  padding: 10px;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-main);
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.menu-item:hover, .menu-item.active {
  background: rgba(80, 181, 255, 0.1);
  color: var(--primary-color);
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.menu-label {
  flex: 1;
}

@media (max-width: 900px) {
  .sidebar-left {
    display: none;
  }
}
</style>
