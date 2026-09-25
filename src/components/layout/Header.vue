<template>
  <header class="social-header" ref="headerRef">
    <div class="header-container">
      <!-- Left: Brand Logo & Search -->
      <div class="header-left">
        <a href="/" class="brand-logo" @click.prevent="goToMainPage">
          <div class="logo-icon">
            <i class="fa-solid fa-rocket"></i>
          </div>
          <span class="logo-text">Rocket</span>
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
              <!-- Topics Section -->
              <div v-if="filteredTopics.length" class="search-section-title">Chủ đề</div>
              <div
                v-for="topic in filteredTopics"
                :key="topic.id"
                class="search-item"
                @click="selectTopicSearch(topic.name)"
              >
                <i class="fa-solid fa-hashtag"></i> #{{ topic.name }}
                <span class="text-muted">({{ topic.post_count }} bài)</span>
              </div>

              <!-- Users Section -->
              <div v-if="filteredUsers.length" class="search-section-title">Người dùng</div>
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

              <!-- Communities Section -->
              <div v-if="filteredCommunities.length" class="search-section-title">Cộng đồng</div>
              <div
                v-for="comm in filteredCommunities"
                :key="comm.id"
                class="search-item"
                @click="selectCommunitySearch(comm)"
              >
                <img :src="comm.avatar" class="avatar avatar-sm rounded-lg" />
                <div>
                  <strong>{{ comm.name }}</strong>
                  <small>c/{{ comm.slug }}</small>
                </div>
              </div>

              <!-- Posts Section -->
              <div v-if="filteredPosts.length" class="search-section-title">Bài viết</div>
              <div
                v-for="post in filteredPosts"
                :key="post.id"
                class="search-item text-xs line-clamp-1"
                @click="selectPostSearch(post)"
              >
                <i class="fa-solid fa-align-left text-indigo-400"></i>
                <span class="truncate">{{ post.content }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Center: Navigation Bar -->
        <nav class="header-nav">
          <button
            class="nav-tab"
            :class="{ active: store.activeTab === 'feed' }"
            @click="navigateTo('/')"
            title="Home Feed"
          >
            <i class="fa-solid fa-house"></i>
            <span class="nav-label">Feed</span>
          </button>

          <button
            class="nav-tab"
            :class="{ active: store.activeTab === 'friends' }"
            @click="navigateTo('/friends?tab=following')"
            title="Đang theo dõi & Đề xuất kết nối"
          >
            <i class="fa-solid fa-user-check"></i>
            <span class="nav-label">Following</span>
          </button>

          <button
            class="nav-tab"
            :class="{ active: store.activeTab === 'communities' }"
            @click="navigateTo('/communities')"
            title="Communities"
          >
            <i class="fa-solid fa-users-rectangle"></i>
            <span class="nav-label">Cộng đồng</span>
          </button>
        </nav>

        <!-- Right: Friends, Messages, Notifications, Settings & Profile / Auth -->
        <div class="header-right">
          <!-- Login / Auth Button if Guest -->
          <button
            v-if="!store.isLoggedIn"
            @click="store.isAuthModalOpen = true"
            class="px-3 py-1.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow"
          >
            Đăng nhập
          </button>

          <!-- Friends Icon Button -->
          <button
            class="btn-icon"
            :class="{ active: store.activeTab === 'friends' }"
            @click="navigateTo('/friends')"
            title="Friends & Connections"
          >
            <i class="fa-solid fa-user-group"></i>
          </button>

          <!-- Messages Icon Button -->
          <button
            class="btn-icon"
            :class="{ active: store.activeTab === 'messages' || store.isChatDrawerOpen }"
            @click="toggleMessages"
            title="Direct Messages & Chat Drawer"
          >
            <i class="fa-regular fa-paper-plane"></i>
            <span v-if="store.totalUnreadCount" class="badge-dot warning"></span>
          </button>

          <!-- Notification Bell Action Button -->
          <div class="popover-wrapper">
            <button
              class="btn-icon"
              :class="{ active: showNotifMenu }"
              @click="toggleNotifMenu"
              title="Notifications"
            >
              <i class="fa-solid fa-bell"></i>
              <span v-if="unreadNotifsCount" class="badge-dot warning"></span>
            </button>

            <div v-if="showNotifMenu" class="popover-dropdown notifications-dropdown card-social">
              <div class="notif-popover-header">
                <h3>Thông báo</h3>
                <button class="btn-link-sm" @click="store.markAllNotificationsRead()">
                  <i class="fa-solid fa-check-double"></i> Đọc tất cả
                </button>
              </div>

              <!-- Filter Pills -->
              <div class="notif-filter-pills">
                <button
                  class="notif-pill"
                  :class="{ active: notifFilter === 'all' }"
                  @click="notifFilter = 'all'"
                >
                  Tất cả
                </button>
                <button
                  class="notif-pill"
                  :class="{ active: notifFilter === 'unread' }"
                  @click="notifFilter = 'unread'"
                >
                  Chưa đọc
                  <span v-if="unreadNotifsCount" class="unread-count-pill">{{ unreadNotifsCount }}</span>
                </button>
              </div>

              <!-- Notification Items List -->
              <div class="notif-list-scroll">
                <div
                  v-for="notif in filteredNotificationsList"
                  :key="notif.id"
                  class="notif-item-row"
                  :class="{ unread: !notif.is_read }"
                  @click="handleNotifClick(notif)"
                >
                  <div class="notif-avatar-wrapper">
                    <img :src="notif.actor?.avatar || defaultAvatar" class="avatar avatar-md" />
                    <span class="notif-type-badge" :class="getNotifBadgeClass(notif.type)">
                      <i :class="getNotifIconClass(notif.type)"></i>
                    </span>
                  </div>

                  <div class="notif-text-wrapper">
                    <p class="notif-text-content">
                      <strong>{{ notif.actor?.display_name || notif.actor?.username }}</strong> {{ notif.message }}
                    </p>
                    <span class="notif-time">{{ notif.created_at || 'Vừa xong' }}</span>
                  </div>

                  <span v-if="!notif.is_read" class="unread-blue-dot"></span>
                </div>

                <div v-if="!filteredNotificationsList.length" class="empty-notif-state">
                  <i class="fa-solid fa-bell-slash"></i>
                  <p>Không có thông báo nào</p>
                </div>
              </div>

              <div class="notif-popover-footer">
                <button class="btn-full-width" @click="goToNotificationsTab">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          </div>

          <!-- Settings Dropdown Toggle -->
          <div class="popover-wrapper">
            <button class="btn-icon" @click="toggleSettingsMenu" title="Display Settings">
              <i class="fa-solid fa-gear"></i>
            </button>
            <div v-if="showSettingsMenu" class="popover-dropdown settings-dropdown card-social">
              <div class="popover-header">
                <h4>Cài đặt & Giao diện</h4>
              </div>

              <!-- Dark Theme Toggle Option -->
              <div class="setting-option-row">
                <span>Chế độ Tối (Dark Mode)</span>
                <label class="switch">
                  <input type="checkbox" :checked="store.darkTheme" @change="store.toggleDarkTheme" />
                  <span class="slider round"></span>
                </label>
              </div>

              <!-- 3 Layout Display Modes (Popup, Right Sidebar, Left Split) -->
              <div class="setting-option-column" style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 10px;">
                <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 6px;">
                  <i class="fa-solid fa-table-columns text-indigo-400"></i> Giao diện hiển thị bình luận
                </span>
                <div class="mode-toggle-group" style="display: flex; gap: 4px;">
                  <button
                    class="mode-btn flex-1 text-center"
                    :class="{ active: store.commentDisplayMode === 'popup' }"
                    @click="store.commentDisplayMode = 'popup'"
                    title="Bình luận dạng Cửa sổ Popup"
                  >
                    Popup
                  </button>
                  <button
                    class="mode-btn flex-1 text-center"
                    :class="{ active: store.commentDisplayMode === 'sidebar' }"
                    @click="store.commentDisplayMode = 'sidebar'"
                    title="Bình luận ở Cột Phải"
                  >
                    Cột Phải
                  </button>
                  <button
                    class="mode-btn flex-1 text-center"
                    :class="{ active: store.commentDisplayMode === 'left_comments' }"
                    @click="store.commentDisplayMode = 'left_comments'"
                    title="Bình luận ở Cột Trái (Left Split)"
                  >
                    Cột Trái
                  </button>
                </div>
              </div>

              <!-- Saved / Bookmarks Option -->
              <div class="setting-option-row" style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 8px;">
                <button
                  @click="navigateTo('/saved'); showSettingsMenu = false"
                  class="flex items-center gap-2 text-xs text-amber-400 font-bold hover:underline"
                >
                  <i class="fa-solid fa-bookmark"></i> Bài viết đã lưu (Bookmarks)
                </button>
              </div>

              <!-- Safety & Moderation Option -->
              <div class="setting-option-row" style="margin-top: 6px; border-top: 1px solid var(--border-color); padding-top: 6px;">
                <button
                  @click="navigateTo('/moderation'); showSettingsMenu = false"
                  class="flex items-center gap-2 text-xs text-indigo-400 font-bold hover:underline"
                >
                  <i class="fa-solid fa-shield-halved"></i> An toàn & Kiểm duyệt (Moderation)
                </button>
              </div>

              <div v-if="store.isLoggedIn" class="setting-option-row" style="margin-top: 8px; border-top: 1px solid var(--border-color); padding-top: 8px;">
                <button @click="store.isLoggedIn = false; showSettingsMenu = false" class="text-xs text-red-400 font-bold hover:underline">
                  <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                </button>
              </div>
            </div>
          </div>

          <!-- User Profile Avatar -->
          <div v-if="store.isLoggedIn" class="profile-menu-wrapper" @click="openMyProfile">
            <div class="avatar-wrapper">
              <img :src="store.currentUser.avatar" class="avatar avatar-md" />
              <span class="avatar-online-dot"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  </template>

  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useThreadsStore } from '@/composables/useThreadsStore'

  const store = useThreadsStore()
  const router = useRouter()

  function navigateTo(path) {
    router.push(path)
  }

  function goToMainPage() {
    store.activeTab = 'feed'
    store.activeFeedFilter = 'home'
    router.push('/')
  }

  const headerRef = ref(null)
  const searchQuery = ref('')
  const showSearchResults = ref(false)
  const showSettingsMenu = ref(false)
  const showNotifMenu = ref(false)
  const notifFilter = ref('all')

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'

  function handleClickOutside(event) {
    if (headerRef.value && !headerRef.value.contains(event.target)) {
      showSearchResults.value = false
      showNotifMenu.value = false
      showSettingsMenu.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  const unreadNotifsCount = computed(() => store.notifications.filter(n => !n.is_read).length)

  const filteredNotificationsList = computed(() => {
    if (notifFilter.value === 'unread') {
      return store.notifications.filter(n => !n.is_read)
    }
    return store.notifications
  })

  const filteredTopics = computed(() => {
    if (!searchQuery.value) return store.topics
    return store.topics.filter(t => t.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  })

  const filteredUsers = computed(() => {
    if (!searchQuery.value) return store.users
    return store.users.filter(u =>
      u.display_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const filteredCommunities = computed(() => {
    if (!searchQuery.value) return store.communities
    return store.communities.filter(c =>
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const filteredPosts = computed(() => {
    if (!searchQuery.value) return []
    const q = searchQuery.value.toLowerCase()
    return store.posts.filter(p => p.content && p.content.toLowerCase().includes(q)).slice(0, 5)
  })

  function toggleMessages() {
    store.isChatDrawerOpen = !store.isChatDrawerOpen
    if (store.isChatDrawerOpen) {
      store.chatDrawerSubView = 'list'
    }
  }

  function toggleNotifMenu() {
    showNotifMenu.value = !showNotifMenu.value
    if (showNotifMenu.value) {
      showSettingsMenu.value = false
    }
  }

  function toggleSettingsMenu() {
    showSettingsMenu.value = !showSettingsMenu.value
    if (showSettingsMenu.value) {
      showNotifMenu.value = false
    }
  }

  function handleNotifClick(notif) {
    store.markNotificationRead(notif.id)
    if (notif.type === 'FOLLOW') {
      store.activeTab = 'friends'
    } else {
      store.activeTab = 'feed'
    }
    showNotifMenu.value = false
  }

  function goToNotificationsTab() {
    store.activeTab = 'notifications'
    showNotifMenu.value = false
  }

  function getNotifBadgeClass(type) {
    if (type === 'LIKE') return 'badge-like'
    if (type === 'REPLY' || type === 'COMMENT') return 'badge-reply'
    if (type === 'FOLLOW') return 'badge-follow'
    if (type === 'QUOTE' || type === 'REPOST') return 'badge-repost'
    return 'badge-default'
  }

  function getNotifIconClass(type) {
    if (type === 'LIKE') return 'fa-solid fa-heart'
    if (type === 'REPLY' || type === 'COMMENT') return 'fa-solid fa-comment'
    if (type === 'FOLLOW') return 'fa-solid fa-user-plus'
    if (type === 'QUOTE' || type === 'REPOST') return 'fa-solid fa-quote-left'
    return 'fa-solid fa-bell'
  }

  function selectTopicSearch(name) {
    router.push(`/topic/${name}`)
    showSearchResults.value = false
    searchQuery.value = ''
  }

  function selectUserSearch(user) {
    store.selectedProfileUser = user
    router.push(`/profile/${user.username}`)
    showSearchResults.value = false
    searchQuery.value = ''
  }

  function selectCommunitySearch(comm) {
    store.selectedCommunity = comm
    router.push(`/c/${comm.slug}`)
    showSearchResults.value = false
    searchQuery.value = ''
  }

  function selectPostSearch(post) {
    store.selectedPostForComments = post
    store.isPostDetailModalOpen = true
    router.push('/')
    showSearchResults.value = false
    searchQuery.value = ''
  }

  function openMyProfile() {
    store.selectedProfileUser = store.currentUser
    router.push('/profile')
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
  width: 320px;
}

.header-search input {
  width: 100%;
  padding: 10px 16px 10px 38px;
  border-radius: 12px;
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
  width: 100%;
  min-width: 320px;
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
  width: 310px;
  padding: 16px;
  z-index: 110;
}

.rotate-180 {
  transform: rotate(180deg);
  display: inline-block;
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

.mode-toggle-group {
  display: flex;
  gap: 6px;
}

.mode-btn {
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 11px;
  font-weight: 700;
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn:hover, .mode-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Facebook Style Notifications Popover Dropdown */
.notifications-dropdown {
  position: absolute;
  top: 125%;
  right: -50px;
  width: 360px;
  padding: 14px;
  z-index: 120;
}

.notif-popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.notif-popover-header h3 {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-main);
}

.btn-link-sm {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.notif-filter-pills {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.notif-pill {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notif-pill.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.unread-count-pill {
  background: var(--danger-color);
  color: white;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
}

.notif-list-scroll {
  max-height: 360px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notif-item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  position: relative;
  transition: background 0.2s ease;
}

.notif-item-row:hover {
  background: var(--bg-surface-secondary);
}

.notif-item-row.unread {
  background: rgba(80, 181, 255, 0.08);
}

.notif-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.notif-type-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: white;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-surface);
}

.badge-like { background: #e0245e; }
.badge-reply { background: #1da1f2; }
.badge-follow { background: #17bf63; }
.badge-repost { background: #7952b3; }
.badge-default { background: var(--primary-color); }

.notif-text-wrapper {
  flex: 1;
  min-width: 0;
}

.notif-text-content {
  font-size: 12px;
  color: var(--text-main);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-text-content strong {
  color: var(--text-main);
}

.notif-time {
  font-size: 10px;
  color: var(--text-muted);
  display: block;
  margin-top: 2px;
}

.unread-blue-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 50%;
  flex-shrink: 0;
}

.empty-notif-state {
  text-align: center;
  padding: 24px 10px;
  color: var(--text-muted);
}

.empty-notif-state i {
  font-size: 24px;
  margin-bottom: 6px;
  display: block;
}

.notif-popover-footer {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.btn-full-width {
  width: 100%;
  padding: 6px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-color);
  background: var(--bg-surface-secondary);
  text-align: center;
  cursor: pointer;
}

.btn-full-width:hover {
  background: var(--primary-color);
  color: white;
}

@media (max-width: 1100px) {
  .nav-label {
    display: none;
  }
}
</style>
