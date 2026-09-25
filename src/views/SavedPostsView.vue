<template>
  <div class="saved-posts-view">
    <!-- Page Header Card -->
    <div class="card-social page-header-card">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="page-title">
            <i class="fa-solid fa-bookmark text-primary"></i> Bài Viết Đã Lưu
          </h2>
          <p class="text-muted text-xs mt-1">
            Danh sách các bài viết và thảo luận bạn đã lưu lại để xem sau.
          </p>
        </div>
        <div class="badge-count-pill">
          <strong>{{ bookmarkedPosts.length }}</strong> bài viết
        </div>
      </div>

      <!-- Quick Search inside Saved Posts -->
      <div v-if="bookmarkedPosts.length > 0" class="saved-search-box mt-3">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm trong bài viết đã lưu..."
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <!-- Posts Stream -->
    <div class="posts-stream">
      <template v-for="post in filteredSavedPosts" :key="post.id">
        <PostCard :post="post" />
      </template>

      <!-- Empty State -->
      <div v-if="!filteredSavedPosts.length" class="card-social empty-saved-card">
        <div class="empty-icon-wrapper">
          <i class="fa-regular fa-bookmark"></i>
        </div>
        <h3>{{ searchQuery ? 'Không tìm thấy bài viết phù hợp' : 'Chưa có bài viết nào được lưu' }}</h3>
        <p class="text-muted">
          {{ searchQuery ? 'Thử tìm kiếm với từ khóa khác.' : 'Bấm vào biểu tượng bookmark trên bài viết bất kỳ để lưu lại tại đây!' }}
        </p>
        <button
          v-if="!searchQuery"
          @click="router.push('/')"
          class="btn-primary px-4 py-2 rounded-xl text-xs font-bold mt-4 inline-flex items-center gap-2"
        >
          <i class="fa-solid fa-house"></i> Khám phá bài viết trên Feed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThreadsStore } from '@/composables/useThreadsStore'
import PostCard from '@/components/post/PostCard.vue'

const store = useThreadsStore()
const router = useRouter()

const searchQuery = ref('')

const bookmarkedPosts = computed(() => {
  return store.posts.filter(p => p.is_bookmarked)
})

const filteredSavedPosts = computed(() => {
  if (!searchQuery.value.trim()) return bookmarkedPosts.value
  const q = searchQuery.value.toLowerCase()
  return bookmarkedPosts.value.filter(p => {
    const contentMatch = p.content && p.content.toLowerCase().includes(q)
    const authorMatch = p.user && (
      (p.user.display_name && p.user.display_name.toLowerCase().includes(q)) ||
      (p.user.username && p.user.username.toLowerCase().includes(q))
    )
    return contentMatch || authorMatch
  })
})
</script>

<style scoped>
.saved-posts-view {
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

.page-header-card {
  padding: 18px 20px;
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-main);
}

.badge-count-pill {
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-muted);
}

.badge-count-pill strong {
  color: var(--primary-color);
  font-size: 14px;
}

.saved-search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--text-muted);
}

.saved-search-box input {
  width: 100%;
  padding: 9px 36px 9px 36px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 12px;
  outline: none;
  transition: all 0.2s ease;
}

.saved-search-box input:focus {
  border-color: var(--primary-color);
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 12px;
}

.posts-stream {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-saved-card {
  text-align: center;
  padding: 48px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(80, 181, 255, 0.1);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 16px;
}

.empty-saved-card h3 {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
}
</style>
