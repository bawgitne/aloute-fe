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

      <!-- Center: Fully Integrated Navigation Bar -->
      <nav class="header-nav">
        <button
          class="nav-tab"
          :class="{ active: activeTab === 'feed' }"
          @click="activeTab = 'feed'"
          title="Home Feed"
        >
          <i class="fa-solid fa-house"></i>
          <span class="nav-label">Feed</span>
        </button>

        <button
          class="nav-tab"
          :class="{ active: activeTab === 'custom_feeds' }"
          @click="activeTab = 'custom_feeds'"
          title="Custom Feeds"
        >
          <i class="fa-solid fa-sliders"></i>
          <span class="nav-label">Feeds</span>
        </button>

        <button
          class="nav-tab"
          :class="{ active: activeTab === 'communities' }"
          @click="activeTab = 'communities'"
          title="Communities"
        >
          <i class="fa-solid fa-users-rectangle"></i>
          <span class="nav-label">Communities</span>
        </button>

        <button
          class="nav-tab"
          :class="{ active: activeTab === 'messages' }"
          @click="activeTab = 'messages'"
          title="Messaging"
        >
          <i class="fa-solid fa-comments"></i>
          <span class="nav-label">Messages</span>
          <span v-if="unreadMessagesCount" class="badge-dot"></span>
        </button>

        <button
          class="nav-tab"
          :class="{ active: activeTab === 'notifications' }"
          @click="activeTab = 'notifications'"
          title="Notifications"
        >
          <i class="fa-solid fa-bell"></i>
          <span class="nav-label">Notifications</span>
          <span v-if="unreadNotifsCount" class="badge-dot warning"></span>
        </button>

        <button
          class="nav-tab"
          :class="{ active: activeTab === 'analytics' }"
          @click="activeTab = 'analytics'"
          title="Analytics"
        >
          <i class="fa-solid fa-chart-line"></i>
          <span class="nav-label">Analytics</span>
        </button>

        <button
          class="nav-tab"
          :class="{ active: activeTab === 'moderation' }"
          @click="activeTab = 'moderation'"
          title="Safety & Moderation"
        >
          <i class="fa-solid fa-shield-halved"></i>
          <span class="nav-label">Safety</span>
        </button>
      </nav>

      <!-- Right: Settings, Notifications, Create Post & Profile -->
      <div class="header-right">
        <!-- Theme Toggle -->
        <button class="btn-icon" @click="toggleDarkTheme" :title="darkTheme ? 'Light Theme' : 'Dark Theme'">
          <i :class="darkTheme ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
        </button>

        <!-- Settings Dropdown Toggle -->
        <div class="popover-wrapper">
          <button class="btn-icon" @click="showSettingsMenu = !showSettingsMenu" title="Display Settings">
            <i class="fa-solid fa-gear"></i>
          </button>
          <div v-if="showSettingsMenu" class="popover-dropdown settings-dropdown card-social">
            <div class="popover-header">
              <h4>Display & Sidebar Settings</h4>
            </div>
            <div class="setting-option-row">
              <span>Show Mini Profile Card on Sidebar</span>
              <label class="switch">
                <input type="checkbox" v-model="showMiniProfileCard" />
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Create Post Action Button -->
        <button class="btn-primary" @click="isCreatePostModalOpen = true">
          <i class="fa-solid fa-plus"></i> Post
        </button>

        <!-- User Profile Avatar -->
        <div class="profile-menu-wrapper" @click="openMyProfile">
          <div class="avatar-wrapper">
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
  showMiniProfileCard,
  activeTab,
  activeFeedFilter,
  selectedProfileUser,
  isCreatePostModalOpen,
  darkTheme,
  toggleDarkTheme
} = useThreadsStore()

const searchQuery = ref('')
const showSearchResults = ref(false)
const showSettingsMenu = ref(false)

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

function openMyProfile() {
  selectedProfileUser.value = currentUser
  activeTab.value = 'profile'
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
  gap: 16px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
}

.logo-text {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.5px;
}

.logo-text small {
  font-size: 10px;
  color: var(--primary-color);
  font-weight: 600;
  text-transform: uppercase;
}

.header-search {
  position: relative;
  width: 240px;
}

.header-search input {
  width: 100%;
  padding: 8px 14px 8px 34px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 12px;
  outline: none;
  transition: all 0.2s ease;
}

.header-search input:focus {
  border-color: var(--primary-color);
  background: var(--bg-surface);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 12px;
}

.search-dropdown {
  position: absolute;
  top: 115%;
  left: 0;
  width: 300px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 105;
}

.search-section-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.search-item:hover {
  background: var(--bg-surface-secondary);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-tab {
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  transition: all 0.2s ease;
}

.nav-tab:hover, .nav-tab.active {
  color: var(--primary-color);
  background: rgba(80, 181, 255, 0.1);
}

.badge-dot {
  width: 7px;
  height: 7px;
  background: var(--danger-color);
  border-radius: 50%;
}

.badge-dot.warning {
  background: var(--warning-color);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.popover-wrapper {
  position: relative;
}

.settings-dropdown {
  position: absolute;
  top: 125%;
  right: 0;
  width: 280px;
  padding: 16px;
  z-index: 110;
}

.setting-option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 0;
}

/* Switch Toggle Styling */
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--border-color-darker);
  transition: .3s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.profile-menu-wrapper {
  cursor: pointer;
}

@media (max-width: 1100px) {
  .nav-label {
    display: none;
  }
}
</style>
