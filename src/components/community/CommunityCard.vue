<template>
  <div class="card-social community-card">
    <div class="comm-cover-container">
      <img :src="community.cover" class="comm-cover" />
      <img :src="community.avatar" class="avatar avatar-lg comm-avatar" />
    </div>
    <div class="comm-card-body">
      <h3 class="comm-title" @click="openDetail">{{ community.name }}</h3>
      <div class="comm-slug">c/{{ community.slug }}</div>
      <p class="comm-desc">{{ community.description }}</p>

      <div class="comm-flairs-row" v-if="community.flairs && community.flairs.length">
        <span
          v-for="flair in community.flairs"
          :key="flair.id"
          class="badge"
          :style="{ backgroundColor: flair.color + '20', color: flair.color }"
        >
          {{ flair.title }}
        </span>
      </div>

      <div class="comm-stats">
        <div><strong>{{ community.member_count }}</strong> Members</div>
        <div class="stat-dot">•</div>
        <div><strong>{{ community.post_count }}</strong> Threads</div>
      </div>
    </div>
    <div class="comm-card-footer">
      <button
        class="btn-full"
        :class="community.is_joined ? 'btn-outline' : 'btn-primary'"
        @click="toggleJoin"
      >
        {{ community.is_joined ? 'Joined Community' : 'Join Community' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useThreadsStore } from '@/composables/useThreadsStore'

const props = defineProps({
  community: { type: Object, required: true }
})

const { activeTab, selectedCommunity, joinCommunity, leaveCommunity } = useThreadsStore()

function openDetail() {
  selectedCommunity.value = props.community
  activeTab.value = 'community_detail'
}

function toggleJoin() {
  if (props.community.is_joined) leaveCommunity(props.community)
  else joinCommunity(props.community)
}
</script>

<style scoped>
.community-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.comm-cover-container {
  position: relative;
  height: 90px;
}

.comm-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comm-avatar {
  position: absolute;
  bottom: -24px;
  left: 20px;
  border: 3px solid var(--bg-surface);
  box-shadow: var(--shadow-sm);
}

.comm-card-body {
  padding: 30px 20px 16px 20px;
  flex: 1;
}

.comm-title {
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  line-height: 1.2;
}

.comm-title:hover {
  color: var(--primary-color);
}

.comm-slug {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 8px;
}

.comm-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comm-flairs-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.comm-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.stat-dot {
  color: var(--text-light);
}

.comm-card-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border-color);
}

.btn-full {
  width: 100%;
  padding: 8px;
  text-align: center;
  justify-content: center;
}
</style>
