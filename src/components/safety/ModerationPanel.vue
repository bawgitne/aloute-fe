<template>
  <div class="moderation-panel">
    <div class="card-social panel-header">
      <h2><i class="fa-solid fa-shield-halved text-primary"></i> Safety, Moderation & Privacy</h2>
      <p class="text-muted">Manage your content reports, blocked accounts, muted users, and hidden posts.</p>
    </div>

    <!-- Sub Navigation Tabs -->
    <div class="card-social tabs-card">
      <div class="tab-buttons">
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'reports' }"
          @click="currentTab = 'reports'"
        >
          Reports <span class="badge badge-primary">{{ moderation.reports.length }}</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'blocked' }"
          @click="currentTab = 'blocked'"
        >
          Blocked Users <span class="badge badge-danger">{{ moderation.blockedUsers.length }}</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'muted' }"
          @click="currentTab = 'muted'"
        >
          Muted Users <span class="badge badge-warning">{{ moderation.mutedUsers.length }}</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'hidden' }"
          @click="currentTab = 'hidden'"
        >
          Hidden Posts <span class="badge badge-secondary">{{ moderation.hiddenPosts.length }}</span>
        </button>
      </div>
    </div>

    <!-- Tab 1: Content Reports -->
    <div v-if="currentTab === 'reports'" class="tab-content">
      <div v-if="moderation.reports.length" class="reports-list">
        <div v-for="rep in moderation.reports" :key="rep.id" class="card-social report-card">
          <div class="report-header">
            <div class="report-title-row">
              <span class="badge badge-danger">{{ rep.reason }}</span>
              <strong class="target-name">Target: {{ rep.target }}</strong>
            </div>
            <span class="badge" :class="getStatusBadgeClass(rep.status)">{{ rep.status }}</span>
          </div>
          <p class="report-desc">{{ rep.description || 'No additional details provided.' }}</p>

          <div class="report-footer flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
            <small class="text-muted">Báo cáo bởi {{ rep.reporter }} • {{ rep.created_at }}</small>
            <div class="flex gap-2">
              <button
                v-if="rep.status !== 'RESOLVED'"
                @click="store.updateReportStatus(rep.id, 'RESOLVED')"
                class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs"
              >
                Xử lý (Resolve)
              </button>
              <button
                v-if="rep.status !== 'REJECTED'"
                @click="store.updateReportStatus(rep.id, 'REJECTED')"
                class="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-lg text-xs"
              >
                Từ chối (Reject)
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="card-social empty-box">
        <i class="fa-solid fa-circle-check text-success font-32"></i>
        <p>No active reports submitted.</p>
      </div>
    </div>

    <!-- Tab 2: Blocked Users -->
    <div v-if="currentTab === 'blocked'" class="tab-content">
      <div v-if="moderation.blockedUsers.length" class="users-list">
        <div v-for="usr in moderation.blockedUsers" :key="usr.id" class="card-social user-row">
          <img :src="usr.avatar" class="avatar avatar-md" />
          <div class="user-details">
            <strong>{{ usr.display_name }}</strong>
            <small>@{{ usr.username }}</small>
          </div>
          <button class="btn-outline btn-sm" @click="unblock(usr)">
            Unblock
          </button>
        </div>
      </div>
      <div v-else class="card-social empty-box">
        <i class="fa-solid fa-user-check text-primary font-32"></i>
        <p>No blocked users.</p>
      </div>
    </div>

    <!-- Tab 3: Muted Users -->
    <div v-if="currentTab === 'muted'" class="tab-content">
      <div v-if="moderation.mutedUsers.length" class="users-list">
        <div v-for="usr in moderation.mutedUsers" :key="usr.id" class="card-social user-row">
          <img :src="usr.avatar" class="avatar avatar-md" />
          <div class="user-details">
            <strong>{{ usr.display_name }}</strong>
            <small>@{{ usr.username }}</small>
          </div>
          <button class="btn-outline btn-sm" @click="unmute(usr)">
            Unmute
          </button>
        </div>
      </div>
      <div v-else class="card-social empty-box">
        <i class="fa-solid fa-volume-high text-success font-32"></i>
        <p>No muted users.</p>
      </div>
    </div>

    <!-- Tab 4: Hidden Posts -->
    <div v-if="currentTab === 'hidden'" class="tab-content">
      <div v-if="moderation.hiddenPosts.length" class="posts-list">
        <div v-for="postId in moderation.hiddenPosts" :key="postId" class="card-social user-row">
          <div>
            <strong>Hidden Thread ID: {{ postId }}</strong>
            <p class="text-muted font-12">This thread is currently hidden from your home feed.</p>
          </div>
          <button class="btn-outline btn-sm" @click="unhide(postId)">
            Unhide Thread
          </button>
        </div>
      </div>
      <div v-else class="card-social empty-box">
        <i class="fa-solid fa-eye text-primary font-32"></i>
        <p>No hidden posts.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const store = useThreadsStore()
const { moderation } = store
const currentTab = ref('reports')

function getStatusBadgeClass(status) {
  if (status === 'RESOLVED') return 'badge-success'
  if (status === 'REJECTED') return 'badge-secondary'
  return 'badge-warning'
}

function unblock(usr) {
  usr.is_blocked = false
  const idx = moderation.blockedUsers.findIndex(u => u.id === usr.id)
  if (idx >= 0) moderation.blockedUsers.splice(idx, 1)
}

function unmute(usr) {
  usr.is_muted = false
  const idx = moderation.mutedUsers.findIndex(u => u.id === usr.id)
  if (idx >= 0) moderation.mutedUsers.splice(idx, 1)
}

function unhide(postId) {
  const idx = moderation.hiddenPosts.indexOf(postId)
  if (idx >= 0) moderation.hiddenPosts.splice(idx, 1)
}
</script>

<style scoped>
.panel-header h2 {
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tabs-card {
  padding: 8px 14px;
}

.tab-buttons {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.tab-btn {
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: var(--primary-gradient);
  color: white;
}

.report-card {
  margin-bottom: 12px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.report-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.report-desc {
  font-size: 13px;
  color: var(--text-main);
  margin-bottom: 10px;
}

.user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 10px;
}

.user-details strong {
  display: block;
  font-size: 14px;
}

.user-details small {
  color: var(--text-muted);
}

.empty-box {
  text-align: center;
  padding: 40px;
}

.font-32 { font-size: 32px; margin-bottom: 10px; }
.font-12 { font-size: 12px; }
.text-success { color: var(--success-color); }
.text-primary { color: var(--primary-color); }
</style>
