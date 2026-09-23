<template>
  <div class="home-view">
    <!-- Story Highlights Bar (SocialV Design Feature) -->
    <div class="card-social story-bar">
      <div class="story-item create-story">
        <div class="avatar-wrapper">
          <img :src="currentUser.avatar" class="avatar avatar-lg" />
          <span class="add-story-plus"><i class="fa-solid fa-plus"></i></span>
        </div>
        <small>Add Story</small>
      </div>

      <div
        v-for="user in users"
        :key="user.id"
        class="story-item"
        @click="openProfile(user)"
      >
        <div class="story-avatar-ring">
          <img :src="user.avatar" class="avatar avatar-lg" />
        </div>
        <small class="truncate-name">{{ user.display_name }}</small>
      </div>
    </div>

    <!-- Quick Post Creator Box -->
    <div class="card-social quick-create-card" @click="isCreatePostModalOpen = true">
      <div class="quick-create-top">
        <img :src="currentUser.avatar" class="avatar avatar-md" />
        <div class="fake-input">Start a thread or ask a question...</div>
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
        :class="{ active: activeFeedFilter === 'home' }"
        @click="activeFeedFilter = 'home'"
      >
        <i class="fa-solid fa-house"></i> For You
      </button>

      <button
        class="filter-pill"
        :class="{ active: activeFeedFilter === 'following' }"
        @click="activeFeedFilter = 'following'"
      >
        <i class="fa-solid fa-user-group"></i> Following
      </button>

      <button
        v-for="feed in customFeeds"
        :key="feed.id"
        class="filter-pill"
        :class="{ active: activeFeedFilter === feed.id }"
        @click="activeFeedFilter = feed.id"
      >
        <i class="fa-solid fa-sliders"></i> {{ feed.name }}
      </button>

      <button
        v-if="isTopicFilterActive"
        class="filter-pill active topic-active-pill"
      >
        <i class="fa-solid fa-hashtag"></i> {{ activeFeedFilter.replace('topic_', '') }}
        <span @click.stop="activeFeedFilter = 'home'"><i class="fa-solid fa-xmark"></i></span>
      </button>
    </div>

    <!-- Posts Stream -->
    <div class="posts-stream">
      <PostCard
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
      />

      <div v-if="!filteredPosts.length" class="card-social empty-feed">
        <i class="fa-solid fa-newspaper empty-icon"></i>
        <h3>No threads found for this feed filter</h3>
        <p>Try switching feed tabs or create the first post!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import PostCard from '@/components/post/PostCard.vue'

const {
  currentUser,
  users,
  posts,
  customFeeds,
  activeFeedFilter,
  activeTab,
  selectedProfileUser,
  isCreatePostModalOpen
} = useThreadsStore()

const isTopicFilterActive = computed(() => activeFeedFilter.value.startsWith('topic_'))

const filteredPosts = computed(() => {
  if (activeFeedFilter.value === 'home') {
    return posts
  }
  if (activeFeedFilter.value === 'following') {
    const followingIds = users.filter(u => u.is_following).map(u => u.id)
    return posts.filter(p => followingIds.includes(p.user_id) || p.user_id === currentUser.id)
  }
  if (isTopicFilterActive.value) {
    const topicName = activeFeedFilter.value.replace('topic_', '')
    return posts.filter(p => p.topics && p.topics.includes(topicName))
  }
  // Custom feed filter
  const targetFeed = customFeeds.find(f => f.id === activeFeedFilter.value)
  if (targetFeed) {
    return posts.filter(p => {
      const matchTopic = p.topics && p.topics.some(t => targetFeed.topics.includes(t))
      const matchUser = targetFeed.users.includes(p.user?.username)
      return matchTopic || matchUser
    })
  }
  return posts
})

function openProfile(usr) {
  selectedProfileUser.value = usr
  activeTab.value = 'profile'
}
</script>

<style scoped>
.story-bar {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px;
  margin-bottom: 20px;
}

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.create-story .add-story-plus {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
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
  max-width: 64px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-create-card {
  padding: 16px;
  cursor: pointer;
}

.quick-create-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.fake-input {
  flex: 1;
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
  font-size: 13px;
  border: 1px solid var(--border-color);
}

.quick-create-toolbar {
  display: flex;
  justify-content: space-around;
  padding-top: 10px;
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
  padding: 10px 14px;
  overflow-x: auto;
}

.filter-pill {
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-surface-secondary);
  white-space: nowrap;
  transition: all 0.2s ease;
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
</style>
