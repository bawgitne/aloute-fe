<template>
  <div class="friends-view">
    <div class="card-social friends-header-card">
      <div class="header-content">
        <h2><i class="fa-solid fa-user-group text-primary"></i> Friends & Connections</h2>
        <p class="text-muted">Manage your friends, followers, and suggested connections.</p>
      </div>

      <div class="friends-search-bar">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search friends by name or @username..."
        />
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="friends-filter-tabs">
      <button
        class="filter-tab"
        :class="{ active: currentTab === 'all' }"
        @click="currentTab = 'all'"
      >
        All Connections <span class="count-badge">{{ otherUsers.length }}</span>
      </button>

      <button
        class="filter-tab"
        :class="{ active: currentTab === 'following' }"
        @click="currentTab = 'following'"
      >
        Following <span class="count-badge">{{ followingUsers.length }}</span>
      </button>

      <button
        class="filter-tab"
        :class="{ active: currentTab === 'followers' }"
        @click="currentTab = 'followers'"
      >
        Followers <span class="count-badge">{{ followerUsers.length }}</span>
      </button>

      <button
        class="filter-tab"
        :class="{ active: currentTab === 'suggestions' }"
        @click="currentTab = 'suggestions'"
      >
        Suggested <span class="count-badge">{{ suggestedUsers.length }}</span>
      </button>
    </div>

    <!-- Friends Grid -->
    <div class="friends-grid">
      <div
        v-for="user in displayedUsers"
        :key="user.id"
        class="card-social friend-card"
      >
        <div class="friend-card-top">
          <div class="avatar-container" @click="viewProfile(user)">
            <img :src="user.avatar" class="avatar avatar-lg" />
            <span class="online-indicator"></span>
          </div>
          <div class="friend-info" @click="viewProfile(user)">
            <h4 class="user-name">
              {{ user.display_name }}
              <i v-if="user.is_verified" class="fa-solid fa-circle-check verified-icon"></i>
            </h4>
            <span class="user-handle">@{{ user.username }}</span>
            <p class="user-bio">{{ user.bio }}</p>
          </div>
        </div>

        <div class="friend-stats-row">
          <div class="stat">
            <strong>{{ user.posts_count || 0 }}</strong>
            <small>Threads</small>
          </div>
          <div class="stat">
            <strong>{{ user.followers_count || 0 }}</strong>
            <small>Followers</small>
          </div>
        </div>

        <div class="friend-card-actions">
          <button
            class="btn-sm btn-primary action-btn"
            @click="messageUser(user)"
            title="Message"
          >
            <i class="fa-solid fa-paper-plane"></i> Message
          </button>

          <button
            class="btn-sm action-btn"
            :class="user.is_following ? 'btn-outline' : 'btn-secondary'"
            @click="user.is_following ? store.unfollowUser(user) : store.followUser(user)"
          >
            <i :class="user.is_following ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'"></i>
            {{ user.is_following ? 'Following' : 'Follow' }}
          </button>
        </div>
      </div>

      <div v-if="!displayedUsers.length" class="card-social empty-state">
        <i class="fa-solid fa-users-slash empty-icon"></i>
        <h3>No connections found</h3>
        <p>Try refining your search term or exploring suggestions.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThreadsStore } from '@/composables/useThreadsStore'

const store = useThreadsStore()
const route = useRoute()
const router = useRouter()

const currentTab = ref('following')
const searchQuery = ref('')

onMounted(() => {
  if (route.query.tab) {
    currentTab.value = route.query.tab
  }
})

watch(() => route.query.tab, (newTab) => {
  if (newTab) currentTab.value = newTab
})

const otherUsers = computed(() => store.users.filter(u => u.id !== store.currentUser.id))
const followingUsers = computed(() => otherUsers.value.filter(u => u.is_following))
const followerUsers = computed(() => otherUsers.value.filter(u => u.is_follower))
const suggestedUsers = computed(() => otherUsers.value.filter(u => !u.is_following && !u.is_follower))

const filteredList = computed(() => {
  let baseList = otherUsers.value
  if (currentTab.value === 'following') baseList = followingUsers.value
  if (currentTab.value === 'followers') baseList = followerUsers.value
  if (currentTab.value === 'suggestions') baseList = suggestedUsers.value

  if (!searchQuery.value) return baseList
  const q = searchQuery.value.toLowerCase()
  return baseList.filter(u =>
    u.display_name.toLowerCase().includes(q) ||
    u.username.toLowerCase().includes(q) ||
    (u.bio && u.bio.toLowerCase().includes(q))
  )
})

const displayedUsers = computed(() => filteredList.value)

function viewProfile(user) {
  store.selectedProfileUser = user
  if (user && user.username) {
    router.push(`/@${user.username}`)
  } else {
    router.push('/profile')
  }
}

function messageUser(user) {
  store.openMiniChat(user)
}
</script>

<style scoped>
.friends-view {
  max-width: 900px;
  margin: 0 auto;
}

.friends-header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;
  margin-bottom: 16px;
}

.header-content h2 {
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
}

.friends-search-bar {
  position: relative;
  width: 300px;
}

.friends-search-bar input {
  width: 100%;
  padding: 8px 14px 8px 34px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 13px;
  outline: none;
}

.friends-search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 12px;
}

.friends-filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.filter-tab {
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.count-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
}

.filter-tab:not(.active) .count-badge {
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.friend-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.friend-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.friend-card-top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
  margin-bottom: 12px;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: var(--success-color);
  border: 2px solid var(--bg-surface);
  border-radius: 50%;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.verified-icon {
  color: var(--primary-color);
  font-size: 12px;
}

.user-handle {
  font-size: 11px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 4px;
}

.user-bio {
  font-size: 12px;
  color: var(--text-main);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.friend-stats-row {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat strong {
  font-size: 13px;
  color: var(--text-main);
}

.stat small {
  font-size: 10px;
  color: var(--text-muted);
}

.friend-card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 36px;
  color: var(--text-light);
  margin-bottom: 10px;
}

.text-primary { color: var(--primary-color); }
</style>
