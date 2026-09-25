<template>
  <div class="communities-view-layout">
    <!-- Main Center Column: Community Scroll Feed -->
    <div class="feed-column">
      <!-- Joined Community Filter Pills & Create Community Button -->
      <div class="card-social feed-filter-bar flex justify-between items-center">
        <div class="flex gap-2 items-center overflow-x-auto flex-1">
          <button
            class="filter-pill"
            :class="{ active: activeCommunityFilter === 'all' }"
            @click="activeCommunityFilter = 'all'"
          >
            <i class="fa-solid fa-layer-group"></i> Tất cả bài viết
          </button>

          <button
            v-for="comm in joinedCommunities"
            :key="comm.id"
            class="filter-pill comm-pill"
            :class="{ active: activeCommunityFilter === comm.id }"
            @click="activeCommunityFilter = comm.id"
          >
            <img :src="comm.avatar" class="pill-avatar" />
            <span>c/{{ comm.slug }}</span>
          </button>
        </div>

        <button
          @click="store.isCreateCommunityModalOpen = true"
          class="btn-create-comm ml-2 flex-shrink-0"
        >
          <i class="fa-solid fa-plus"></i> Tạo Cộng Đồng
        </button>
      </div>

      <!-- Posts Feed Stream -->
      <div class="posts-stream">
        <template v-for="post in communityPosts" :key="post.id">
          <PostCard :post="post" />
        </template>

        <!-- Empty Feed State -->
        <div v-if="!communityPosts.length" class="card-social empty-feed-card">
          <i class="fa-solid fa-comments-nolines empty-icon"></i>
          <h3>Chưa có bài viết nào trong feed cộng đồng</h3>
          <p class="text-muted">Tham gia thêm các cộng đồng đề xuất bên phải hoặc chọn một cộng đồng khác để đăng bài!</p>
        </div>
      </div>
    </div>

    <!-- Right Sidebar Column: Joined List & Suggested List -->
    <aside class="sidebar-right-column">
      <!-- Top Card: List Cộng Đồng Đã Tham Gia -->
      <div class="card-social widget-card">
        <div class="widget-header">
          <h3>
            <i class="fa-solid fa-circle-check text-indigo-400"></i>
            Cộng đồng đã tham gia
          </h3>
          <span class="count-badge">{{ joinedCommunities.length }}</span>
        </div>

        <div class="widget-body">
          <div
            v-for="comm in joinedCommunities"
            :key="comm.id"
            class="community-list-item cursor-pointer"
            @click="openCommunity(comm)"
          >
            <img :src="comm.avatar" class="avatar avatar-md rounded-xl" />
            <div class="comm-meta flex-1 min-w-0">
              <strong class="comm-name truncate block">{{ comm.name }}</strong>
              <small class="comm-sub text-muted">c/{{ comm.slug }} • {{ formatCount(comm.member_count) }} thành viên</small>
            </div>
            <i class="fa-solid fa-chevron-right chevron-icon"></i>
          </div>

          <div v-if="!joinedCommunities.length" class="empty-small-text">
            Bạn chưa tham gia cộng đồng nào.
          </div>
        </div>
      </div>

      <!-- Bottom Card: Đề Xuất Cộng Đồng -->
      <div class="card-social widget-card mt-4">
        <div class="widget-header">
          <h3>
            <i class="fa-solid fa-compass text-warning"></i>
            Đề xuất cộng đồng
          </h3>
          <span class="count-badge warning-badge">{{ suggestedCommunities.length }}</span>
        </div>

        <div class="widget-body">
          <div
            v-for="comm in suggestedCommunities"
            :key="comm.id"
            class="community-suggest-item"
          >
            <div class="suggest-top-row flex items-center gap-3" @click="openCommunity(comm)">
              <img :src="comm.avatar" class="avatar avatar-md rounded-xl cursor-pointer" />
              <div class="comm-meta flex-1 min-w-0 cursor-pointer">
                <strong class="comm-name truncate block hover:text-indigo-400">{{ comm.name }}</strong>
                <small class="comm-sub text-muted">c/{{ comm.slug }} • {{ formatCount(comm.member_count) }} thành viên</small>
              </div>
            </div>

            <p v-if="comm.description" class="comm-desc line-clamp-2 mt-2 text-xs text-gray-400">
              {{ comm.description }}
            </p>

            <div class="suggest-action-row mt-3 flex justify-end">
              <button
                class="btn-sm btn-primary px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm hover:opacity-90 transition flex items-center gap-1.5"
                @click.stop="store.joinCommunity(comm)"
              >
                <i class="fa-solid fa-plus"></i> Tham gia
              </button>
            </div>
          </div>

          <div v-if="!suggestedCommunities.length" class="empty-small-text">
            Bạn đã tham gia tất cả các cộng đồng hiện có!
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThreadsStore } from '@/composables/useThreadsStore'
import PostCard from '@/components/post/PostCard.vue'

const store = useThreadsStore()
const router = useRouter()

const activeCommunityFilter = ref('all') // 'all' or community.id

const joinedCommunities = computed(() => store.communities.filter(c => c.is_joined))
const suggestedCommunities = computed(() => store.communities.filter(c => !c.is_joined))

const joinedCommunityIds = computed(() => joinedCommunities.value.map(c => c.id))

const communityPosts = computed(() => {
  return store.posts.filter(p => {
    // If post belongs to a community
    if (!p.community_id) return false
    if (activeCommunityFilter.value !== 'all') {
      return p.community_id === activeCommunityFilter.value
    }
    return joinedCommunityIds.value.includes(p.community_id)
  })
})

function openCommunity(comm) {
  store.selectedCommunity = comm
  router.push(`/c/${comm.slug}`)
}

function formatCount(num) {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}
</script>

<style scoped>
.communities-view-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  max-width: 1020px;
  width: 100%;
  margin: 0 auto;
}

.feed-column {
  flex: 1;
  min-width: 0;
  max-width: 640px;
}

.sidebar-right-column {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.page-header-card {
  padding: 16px 20px;
  margin-bottom: 16px;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-top-row h2 {
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-create-comm {
  padding: 8px 16px;
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.btn-create-comm:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
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
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill.active {
  background: var(--primary-color);
  color: white;
}

.pill-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
}

.posts-stream {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-feed-card {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 42px;
  color: var(--text-light);
  margin-bottom: 12px;
}

/* Sidebar Widgets */
.widget-card {
  padding: 16px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.widget-header h3 {
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-badge {
  background: var(--bg-surface-secondary);
  color: var(--primary-color);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color);
}

.warning-badge {
  color: var(--warning-color);
}

.widget-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.community-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: var(--radius-md);
  transition: background 0.15s ease;
}

.community-list-item:hover {
  background: var(--bg-surface-secondary);
}

.comm-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.comm-sub {
  font-size: 11px;
}

.chevron-icon {
  font-size: 11px;
  color: var(--text-light);
}

.community-suggest-item {
  padding: 10px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.empty-small-text {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  padding: 12px 0;
}

.text-success { color: var(--success-color); }
.text-warning { color: var(--warning-color); }

@media (max-width: 960px) {
  .communities-view-layout {
    flex-direction: column;
  }
  .sidebar-right-column {
    width: 100%;
  }
  .feed-column {
    max-width: 100%;
  }
}
</style>
