<template>
  <div class="profile-view">
    <!-- Header Banner & Info -->
    <ProfileHeader :user="targetUser" />

    <!-- Profile Tabs -->
    <div class="card-social tabs-card">
      <div class="profile-tab-buttons">
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'posts' }"
          @click="currentTab = 'posts'"
        >
          Threads
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'replies' }"
          @click="currentTab = 'replies'"
        >
          Replies
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'reposts' }"
          @click="currentTab = 'reposts'"
        >
          Reposts
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'media' }"
          @click="currentTab = 'media'"
        >
          Media
        </button>
        <button
          v-if="targetUser.id === currentUser.id"
          class="tab-btn"
          :class="{ active: currentTab === 'bookmarks' }"
          @click="currentTab = 'bookmarks'"
        >
          Bookmarks
        </button>
      </div>
    </div>

    <!-- Posts Content -->
    <div class="profile-posts-stream">
      <PostCard
        v-for="post in tabPosts"
        :key="post.id"
        :post="post"
      />

      <div v-if="!tabPosts.length" class="card-social empty-box">
        <i class="fa-solid fa-folder-open font-32 text-muted"></i>
        <p>No threads found in this category.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import PostCard from '@/components/post/PostCard.vue'

const { currentUser, selectedProfileUser, posts } = useThreadsStore()

const targetUser = computed(() => selectedProfileUser.value || currentUser)
const currentTab = ref('posts')

const tabPosts = computed(() => {
  const uid = targetUser.value.id
  if (currentTab.value === 'posts') {
    return posts.filter(p => p.user_id === uid && !p.parent_post_id)
  }
  if (currentTab.value === 'replies') {
    return posts.filter(p => p.user_id === uid || p.replies?.some(r => r.user_id === uid))
  }
  if (currentTab.value === 'reposts') {
    return posts.filter(p => p.is_reposted && p.user_id === uid)
  }
  if (currentTab.value === 'media') {
    return posts.filter(p => p.user_id === uid && p.media && p.media.length)
  }
  if (currentTab.value === 'bookmarks') {
    return posts.filter(p => p.is_bookmarked)
  }
  return []
})
</script>

<style scoped>
.profile-view {
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

.tabs-card {
  padding: 8px 16px;
  margin-bottom: 20px;
}

.profile-tab-buttons {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.tab-btn {
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 13px;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.empty-box {
  text-align: center;
  padding: 40px;
}

.font-32 { font-size: 32px; margin-bottom: 8px; }
</style>
