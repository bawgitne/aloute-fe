<template>
  <header class="social-header">
    <div class="header-container">
      <!-- Left: Brand Logo & Search -->
      <div class="header-left">
        <a href="#" class="brand-logo" @click.prevent="activeTab = 'feed'">
          <div class="logo-icon">
            <i class="fa-solid fa-at"></i>
          </div>
          <span class="logo-text">SocialV <small>Threads</small></span>
        </a>
        <div class="header-search">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search users, posts, topics, communities..."
            @focus="showSearchResults = true"
          />
          <div v-if="showSearchResults && searchQuery" class="search-dropdown card-social">
            <div class="search-section-title">Topics</div>
            <div
              v-for="topic in filteredTopics"
              :key="topic.id"
              class="search-item"
              @click="selectTopicSearch(topic.name)"
            >
              <i class="fa-solid fa-hashtag"></i> #{{ topic.name }}
              <span class="text-muted">({{ topic.post_count }} posts)</span>
            </div>
            <div class="search-section-title">Users</div>
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="search-item"
              @click="selectUserSearch(user)"
            >
              <img :src="user.avatar" class="avatar avatar-sm" />
              <div>
                <strong>{{ user.display_name }}</strong>
                <small>@{{ user.username }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center: Main Navigation Quick Tabs -->
      <nav class="header-nav">
        <button
          class="nav-tab"
          :class="{ active: activeTab === 'feed' }"
          @click="activeTab = 'feed'"
          title="Home Feed"
        >
          <i class="fa-solid fa-house"></i>
        </button>
        <button
          class="nav-tab"
          :class="{ active: activeTab === 'communities' }"
          @click="activeTab = 'communities'"
          title="Communities"
        >
          <i class="fa-solid fa-users"></i>
        </button>
        <button
          class="nav-tab"
          :class="{ active: activeTab === 'custom_feeds' }"
          @click="activeTab = 'custom_feeds'"
          title="Custom Feeds"
        >
          <i class="fa-solid fa-sliders"></i>
        </button>
        <button
          class="nav-tab"
          :class="{ active: activeTab === 'messages' }"
          @click="activeTab = 'messages'"
          title="Messaging"
        >
          <i class="fa-solid fa-paper-plane"></i>
          <span v-if="unreadMessagesCount" class="badge-dot"></span>
        </button>
      </nav>

      <!-- Right: Action Buttons, Popovers & Profile -->
      <div class="header-right">
        <!-- Theme Toggle -->
        <button class="btn-icon" @click="toggleDarkTheme" :title="darkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'">
          <i :class="darkTheme ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
        </button>

        <!-- Notifications Popover Dropdown -->
        <div class="popover-wrapper">
          <button class="btn-icon" @click="toggleNotifications" title="Notifications">
            <i class="fa-solid fa-bell"></i>
            <span v-if="unreadNotifsCount" class="badge-count">{{ unreadNotifsCount }}</span>
          </button>

          <div v-if="showNotifications" class="popover-dropdown card-social">
            <div class="popover-header">
              <h4>Notifications</h4>
              <button class="btn-text" @click="markNotifsRead">Mark all read</button>
            </div>
            <div class="popover-body">
              <div
                v-for="notif in notifications"
                :key="notif.id"
                class="notif-item"
                :class="{ unread: !notif.is_read }"
              >
                <img :src="notif.actor.avatar" class="avatar avatar-sm" />
                <div class="notif-content">
                  <p><strong>{{ notif.actor.name }}</strong> {{ notif.message }}</p>
                  <small>{{ notif.created_at }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Post Action Button -->
        <button class="btn-primary" @click="isCreatePostModalOpen = true">
          <i class="fa-solid fa-plus"></i> Post
        </button>

        <!-- User Profile Dropdown -->
        <div class="profile-menu-wrapper">
          <div class="avatar-wrapper" @click="activeTab = 'profile'">
            <img :src="currentUser.avatar" class="avatar avatar-md" />
            <span class="avatar-online-dot"></span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const {
  currentUser,
  users,
  topics,
  notifications,
  conversations,
  activeTab,
  activeFeedFilter,
  selectedProfileUser,
  isCreatePostModalOpen,
  darkTheme,
  toggleDarkTheme
} = useThreadsStore()

const searchQuery = ref('')
const showSearchResults = ref(false)
const showNotifications = ref(false)

const unreadNotifsCount = computed(() => notifications.filter(n => !n.is_read).length)
const unreadMessagesCount = computed(() => conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0))

const filteredTopics = computed(() => {
  if (!searchQuery.value) return topics
  return topics.filter(t => t.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users
  return users.filter(u =>
    u.display_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function selectTopicSearch(name) {
  activeFeedFilter.value = `topic_${name}`
  activeTab.value = 'feed'
  showSearchResults.value = false
  searchQuery.value = ''
}

function selectUserSearch(user) {
  selectedProfileUser.value = user
  activeTab.value = 'profile'
  showSearchResults.value = false
  searchQuery.value = ''
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function markNotifsRead() {
  notifications.forEach(n => (n.is_read = true))
}
</script>

<style scoped>
.social-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.header-container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;

}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
}

.logo-text {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.5px;
}

.logo-text small {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 600;
  text-transform: uppercase;
}

.header-search {
  position: relative;
  width: 280px;
}

.header-search input {
  width: 100%;
  padding: 9px 16px 9px 38px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
}

.header-search input:focus {
  border-color: var(--primary-color);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px rgba(80, 181, 255, 0.15);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 13px;
}

.search-dropdown {
  position: absolute;
  top: 115%;
  left: 0;
  width: 320px;
  max-height: 360px;
  overflow-y: auto;
  z-index: 105;
}

.search-section-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-item:hover {
  background: var(--bg-surface-secondary);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-tab {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
}

.nav-tab:hover, .nav-tab.active {
  color: var(--primary-color);
  background: rgba(80, 181, 255, 0.1);
}

.badge-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: var(--danger-color);
  border-radius: 50%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.popover-wrapper {
  position: relative;
}

.badge-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--danger-color);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-pill);
}

.popover-dropdown {
  position: absolute;
  top: 125%;
  right: 0;
  width: 320px;
  padding: 16px;
  z-index: 110;
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.btn-text {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
}

.notif-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.notif-item.unread {
  background: rgba(80, 181, 255, 0.05);
  border-radius: var(--radius-sm);
  padding: 8px;
}

.notif-content p {
  font-size: 12px;
  line-height: 1.3;
}

.notif-content small {
  color: var(--text-light);
  font-size: 11px;
}
</style>
