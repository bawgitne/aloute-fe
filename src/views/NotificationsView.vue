<template>
  <div class="notifications-view">
    <div class="card-social page-header">
      <div class="header-content">
        <div>
          <h2><i class="fa-solid fa-bell text-warning"></i> Notifications Center</h2>
          <p class="text-muted">Stay up to date with your thread interactions and community activity.</p>
        </div>
        <button class="btn-outline btn-sm" @click="markAllRead">
          Mark All Read
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="card-social tabs-card">
      <div class="filter-buttons">
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'ALL' }"
          @click="currentTab = 'ALL'"
        >
          All Notifications
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'LIKE' }"
          @click="currentTab = 'LIKE'"
        >
          Likes
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'REPLY' }"
          @click="currentTab = 'REPLY'"
        >
          Replies
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'FOLLOW' }"
          @click="currentTab = 'FOLLOW'"
        >
          Follows
        </button>
      </div>
    </div>

    <!-- Notifications Stream -->
    <div class="notifications-list">
      <div
        v-for="notif in filteredNotifs"
        :key="notif.id"
        class="card-social notif-card-row"
        :class="{ unread: !notif.is_read }"
      >
        <div class="notif-icon-col">
          <i :class="getNotifIcon(notif.type)"></i>
        </div>

        <img v-if="notif.actor" :src="notif.actor.avatar" class="avatar avatar-md" />

        <div class="notif-body-col">
          <p><strong v-if="notif.actor">{{ notif.actor.name }} @{{ notif.actor.username }}</strong> {{ notif.message }}</p>
          <small class="text-muted">{{ notif.created_at }}</small>
        </div>

        <span v-if="!notif.is_read" class="badge badge-primary">New</span>
      </div>

      <div v-if="!filteredNotifs.length" class="card-social empty-box">
        <i class="fa-solid fa-bell-slash font-32 text-muted"></i>
        <p>No notifications in this tab.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const { notifications } = useThreadsStore()
const currentTab = ref('ALL')

const filteredNotifs = computed(() => {
  if (currentTab.value === 'ALL') return notifications
  return notifications.filter(n => n.type === currentTab.value)
})

function getNotifIcon(type) {
  if (type === 'LIKE') return 'fa-solid fa-heart text-danger'
  if (type === 'REPLY') return 'fa-solid fa-comment text-primary'
  if (type === 'QUOTE' || type === 'REPOST') return 'fa-solid fa-retweet text-success'
  if (type === 'FOLLOW') return 'fa-solid fa-user-plus text-warning'
  return 'fa-solid fa-bell text-primary'
}

function markAllRead() {
  notifications.forEach(n => (n.is_read = true))
}
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
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

.notif-card-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  margin-bottom: 10px;
}

.notif-card-row.unread {
  border-left: 4px solid var(--primary-color);
  background: rgba(80, 181, 255, 0.04);
}

.notif-icon-col {
  font-size: 18px;
}

.notif-body-col {
  flex: 1;
}

.notif-body-col p {
  font-size: 13px;
  line-height: 1.4;
}

.empty-box {
  text-align: center;
  padding: 40px;
}

.font-32 { font-size: 32px; margin-bottom: 10px; }
.text-danger { color: var(--danger-color); }
.text-primary { color: var(--primary-color); }
.text-success { color: var(--success-color); }
.text-warning { color: var(--warning-color); }
</style>
