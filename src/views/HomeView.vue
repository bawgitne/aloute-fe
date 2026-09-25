<template>
  <div class="home-view-layout" :class="{ 'comments-on-left': store.commentDisplayMode === 'left_comments' }">
    <!-- Left Side-Panel Column (Shown when commentDisplayMode === 'left_comments') -->
    <div
      v-if="store.commentDisplayMode === 'left_comments'"
      class="comments-column comments-column-left"
      :style="{ transform: `translateY(${store.selectedPostOffsetTop}px)`, transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }"
    >
      <PostCommentsSidePanel :post="store.selectedPostForComments" />
    </div>

    <!-- Feed Stream Column -->
    <div class="feed-stream-column">
      <!-- Story Highlights Bar -->
      <div class="card-social story-bar">
        <div class="story-item create-story cursor-pointer" @click="store.isCreateStoryModalOpen = true">
          <div class="avatar-wrapper">
            <img :src="store.currentUser.avatar" class="avatar avatar-lg" />
            <span class="add-story-plus"><i class="fa-solid fa-plus"></i></span>
          </div>
          <small>Tạo tin mới</small>
        </div>

        <div
          v-for="group in store.stories"
          :key="group.id"
          class="story-item cursor-pointer"
          @click="store.openStoryViewer(group)"
        >
          <div class="story-avatar-ring border-2 border-indigo-500 rounded-full p-0.5">
            <img :src="group.user?.avatar || store.currentUser.avatar" class="avatar avatar-lg rounded-full object-cover" />
          </div>
          <small class="truncate-name">{{ group.user?.display_name || group.user?.username }}</small>
        </div>
      </div>

      <!-- Quick Post Creator Box -->
      <div class="card-social quick-create-card" @click="store.isCreatePostModalOpen = true">
        <div class="quick-create-top">
          <img :src="store.currentUser.avatar" class="avatar avatar-md" />
          <div class="fake-input">Bạn đang nghĩ gì?...</div>
        </div>
        <div class="quick-create-toolbar">
          <button class="quick-btn text-success"><i class="fa-solid fa-image"></i> Photo/Video</button>
          <button class="quick-btn text-primary"><i class="fa-solid fa-square-poll-vertical"></i> Poll</button>
          <button class="quick-btn text-warning"><i class="fa-solid fa-hashtag"></i> Topic Tag</button>
        </div>
      </div>

      <!-- Feed Filter Navigation Pills -->
      <div class="card-social feed-filter-bar">
        <button
          class="filter-pill"
          :class="{ active: store.activeFeedFilter === 'home' }"
          @click="store.activeFeedFilter = 'home'"
        >
          <i class="fa-solid fa-house"></i> Dành cho bạn
        </button>

        <button
          class="filter-pill"
          :class="{ active: store.activeFeedFilter === 'following' }"
          @click="store.activeFeedFilter = 'following'"
        >
          <i class="fa-solid fa-user-group"></i> Đang theo dõi
        </button>

        <button
          v-for="feed in store.customFeeds"
          :key="feed.id"
          class="filter-pill"
          :class="{ active: store.activeFeedFilter === feed.id }"
          @click="store.activeFeedFilter = feed.id"
        >
          <i class="fa-solid fa-sliders"></i> {{ feed.name }}
        </button>

        <button
          v-if="isTopicFilterActive"
          class="filter-pill active topic-active-pill"
        >
          <i class="fa-solid fa-hashtag"></i> {{ store.activeFeedFilter.replace('topic_', '') }}
          <span @click.stop="store.activeFeedFilter = 'home'"><i class="fa-solid fa-xmark"></i></span>
        </button>
      </div>

      <!-- Feed Posts Stream with Inline "People to Follow" Suggestions -->
      <div class="posts-stream">
        <template v-for="(post, index) in filteredPosts" :key="post.id">
          <PostCard :post="post" />

          <!-- Inline Suggested People to Follow Card -->
          <div
            v-if="index === 0 && recommendedUsers.length"
            class="card-social inline-recommendation-card"
          >
            <div class="recommendation-header">
              <span class="recommendation-title">
                <i class="fa-solid fa-user-plus text-primary"></i> Gợi ý theo dõi
              </span>
              <small class="text-muted">Dựa trên chủ đề của bạn</small>
            </div>

            <div class="recommendation-users-row">
              <div
                v-for="usr in recommendedUsers"
                :key="usr.id"
                class="suggested-user-card"
              >
                <img :src="usr.avatar" class="avatar avatar-md" />
                <strong @click="openProfile(usr)">{{ usr.display_name }}</strong>
                <small>@{{ usr.username }}</small>
                <button
                  class="btn-sm"
                  :class="usr.is_following ? 'btn-outline' : 'btn-primary'"
                  @click="usr.is_following ? store.unfollowUser(usr) : store.followUser(usr)"
                >
                  {{ usr.is_following ? 'Following' : 'Follow' }}
                </button>
              </div>
            </div>
          </div>
        </template>

        <div v-if="!filteredPosts.length" class="card-social empty-feed">
          <i class="fa-solid fa-newspaper empty-icon"></i>
          <h3>Không tìm thấy bài viết nào</h3>
          <p>Thử chuyển sang feed khác hoặc tạo bài viết mới!</p>
        </div>
      </div>
    </div>

    <!-- Right Side-Panel Column (Shown ONLY when commentDisplayMode === 'sidebar') -->
    <div
      v-if="store.commentDisplayMode === 'sidebar'"
      class="comments-column comments-column-right"
      :style="{ transform: `translateY(${store.selectedPostOffsetTop}px)`, transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }"
    >
      <PostCommentsSidePanel :post="store.selectedPostForComments" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import PostCard from '@/components/post/PostCard.vue'
import PostCommentsSidePanel from '@/components/post/PostCommentsSidePanel.vue'

const store = useThreadsStore()

const filterValue = computed(() => {
  const val = store.activeFeedFilter
  return typeof val === 'string' ? val : (val?.value || 'home')
})

const isTopicFilterActive = computed(() => filterValue.value.startsWith('topic_'))

const recommendedUsers = computed(() => store.users.filter(u => u.id !== store.currentUser.id))

const filteredPosts = computed(() => {
  const activeFilter = filterValue.value
  let basePosts = store.posts.filter(p => {
    // Filter out Blocked / Muted users
    const isBlocked = p.user?.is_blocked || store.moderation.blockedUsers.some(u => u.id === p.user_id)
    const isMuted = p.user?.is_muted || store.moderation.mutedUsers.some(u => u.id === p.user_id)
    if (isBlocked || isMuted) return false

    // Enforce Visibility
    const vis = (p.visibility || 'PUBLIC').toUpperCase()
    const isAuthor = p.user_id === store.currentUser.id
    if (vis === 'FOLLOWERS') {
      const isFollowing = p.user?.is_following || store.users.some(u => u.id === p.user_id && u.is_following)
      if (!isAuthor && !isFollowing) return false
    }
    if (vis === 'MENTIONED') {
      const isMentioned = p.content?.includes(`@${store.currentUser.username}`)
      if (!isAuthor && !isMentioned) return false
    }

    return true
  })

  if (activeFilter === 'home') {
    return basePosts
  }
  if (activeFilter === 'following') {
    const followingIds = store.users.filter(u => u.is_following).map(u => u.id)
    return basePosts.filter(p => followingIds.includes(p.user_id) || p.user_id === store.currentUser.id)
  }
  if (isTopicFilterActive.value) {
    const topicName = activeFilter.replace('topic_', '')
    return basePosts.filter(p => p.topics && p.topics.includes(topicName))
  }
  const targetFeed = store.customFeeds.find(f => f.id === activeFilter)
  if (targetFeed) {
    return basePosts.filter(p => {
      const matchTopic = p.topics && p.topics.some(t => targetFeed.topics.includes(t))
      const matchUser = targetFeed.users.includes(p.user?.username)
      return matchTopic || matchUser
    })
  }
  return basePosts
})

function openProfile(usr) {
  store.selectedProfileUser = usr
  store.activeTab = 'profile'
}
</script>

<style scoped>
.home-view-layout {
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: flex-start;
  position: relative;
  width: 100%;
}

.home-view-layout.comments-on-left {
  justify-content: flex-start;
  gap: 16px;
}

.feed-stream-column {
  max-width: 640px;
  width: 100%;
  flex: 1;
}

.comments-column {
  width: 380px;
  flex-shrink: 0;
  will-change: transform;
}

.story-bar {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 14px;
  margin-bottom: 16px;
}

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.create-story .add-story-plus {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 18px;
  height: 18px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-surface);
}

.story-avatar-ring {
  padding: 2px;
  border-radius: 50%;
  background: var(--primary-gradient);
}

.truncate-name {
  font-size: 11px;
  font-weight: 600;
  max-width: 60px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-create-card {
  padding: 14px;
  cursor: pointer;
  margin-bottom: 16px;
}

.quick-create-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.fake-input {
  flex: 1;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
  font-size: 13px;
  border: 1px solid var(--border-color);
}

.quick-create-toolbar {
  display: flex;
  justify-content: space-around;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.feed-filter-bar {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.filter-pill {
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-surface-secondary);
  white-space: nowrap;
}

.filter-pill.active {
  background: var(--primary-color);
  color: white;
}

.topic-active-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--warning-color);
}

.inline-recommendation-card {
  margin-bottom: 16px;
  padding: 14px;
  background: var(--bg-surface-secondary);
  border: 1px dashed var(--primary-color);
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.recommendation-title {
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}

.recommendation-users-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
}

.suggested-user-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.suggested-user-card strong {
  font-size: 12px;
  font-weight: 700;
  margin-top: 6px;
  cursor: pointer;
}

.suggested-user-card small {
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.btn-sm {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
}

.empty-feed {
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 40px;
  color: var(--text-light);
  margin-bottom: 12px;
}

.text-success { color: var(--success-color); }
.text-primary { color: var(--primary-color); }
.text-warning { color: var(--warning-color); }

@media (max-width: 1000px) {
  .comments-column {
    display: none;
  }
}
</style>
