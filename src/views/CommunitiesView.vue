<template>
  <div class="communities-view">
    <div class="card-social page-header">
      <div class="header-content flex justify-between items-center">
        <div>
          <h2><i class="fa-solid fa-users-rectangle text-success"></i> Thư viện Cộng Đồng</h2>
          <p class="text-muted">Khám phá và tham gia các không gian trao đổi theo chủ đề.</p>
        </div>
        <button
          @click="store.isCreateCommunityModalOpen = true"
          class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <i class="fa-solid fa-plus"></i> Tạo Cộng Đồng
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="card-social tabs-card">
      <div class="filter-buttons">
        <button
          class="tab-btn"
          :class="{ active: filter === 'all' }"
          @click="filter = 'all'"
        >
          Tất cả cộng đồng
        </button>
        <button
          class="tab-btn"
          :class="{ active: filter === 'joined' }"
          @click="filter = 'joined'"
        >
          Đã tham gia
        </button>
      </div>
    </div>

    <!-- Community Grid -->
    <div class="communities-grid">
      <CommunityCard
        v-for="comm in filteredCommunities"
        :key="comm.id"
        :community="comm"
      />
    </div>

    <div v-if="!filteredCommunities.length" class="card-social empty-box">
      <i class="fa-solid fa-users-slash font-32 text-muted"></i>
      <p>Không tìm thấy cộng đồng nào.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import CommunityCard from '@/components/community/CommunityCard.vue'

const store = useThreadsStore()
const filter = ref('all')

const filteredCommunities = computed(() => {
  if (filter.value === 'joined') return store.communities.filter(c => c.is_joined)
  return store.communities
})
</script>

<style scoped>
.communities-view {
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tabs-card {
  padding: 8px 14px;
  margin-bottom: 20px;
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

.tab-btn {
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 13px;
  color: var(--text-muted);
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.communities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.empty-box {
  text-align: center;
  padding: 40px;
}

.font-32 { font-size: 32px; margin-bottom: 10px; }
.text-success { color: var(--success-color); }
</style>
