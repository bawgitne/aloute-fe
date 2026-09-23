<template>
  <div class="analytics-view">
    <div class="card-social page-header">
      <h2><i class="fa-solid fa-chart-line text-primary"></i> Account & Thread Analytics Overview</h2>
      <p class="text-muted">Real-time performance metrics across your posts, views, and link clicks.</p>
    </div>

    <!-- Summary Metric Cards Grid -->
    <div class="summary-metrics-grid">
      <div class="card-social metric-card">
        <div class="metric-header">
          <i class="fa-solid fa-eye text-primary metric-icon"></i>
          <span class="badge badge-success">+18% vs last week</span>
        </div>
        <div class="metric-value">{{ totalViews }}</div>
        <div class="metric-title">Total Thread Views</div>
      </div>

      <div class="card-social metric-card">
        <div class="metric-header">
          <i class="fa-solid fa-arrow-pointer text-success metric-icon"></i>
          <span class="badge badge-primary">+24%</span>
        </div>
        <div class="metric-value">{{ totalClicks }}</div>
        <div class="metric-title">Link Clicks</div>
      </div>

      <div class="card-social metric-card">
        <div class="metric-header">
          <i class="fa-solid fa-heart text-danger metric-icon"></i>
          <span class="badge badge-warning">+12%</span>
        </div>
        <div class="metric-value">{{ totalLikes }}</div>
        <div class="metric-title">Total Likes</div>
      </div>

      <div class="card-social metric-card">
        <div class="metric-header">
          <i class="fa-solid fa-bolt text-warning metric-icon"></i>
          <span class="badge badge-success">High</span>
        </div>
        <div class="metric-value">5.8%</div>
        <div class="metric-title">Avg. Engagement Rate</div>
      </div>
    </div>

    <!-- Top Performing Posts Table -->
    <div class="card-social top-posts-card">
      <h3>Top Performing Threads</h3>
      <div class="table-responsive">
        <table class="analytics-table">
          <thead>
            <tr>
              <th>Thread Content</th>
              <th>Created</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Replies</th>
              <th>Link Clicks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in myPosts" :key="post.id">
              <td class="content-cell">"{{ post.content }}"</td>
              <td>{{ post.created_at }}</td>
              <td><strong>{{ post.view_count || 120 }}</strong></td>
              <td>{{ post.like_count }}</td>
              <td>{{ post.reply_count }}</td>
              <td><span class="badge badge-primary">{{ post.link_clicks_count || 0 }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const { currentUser, posts } = useThreadsStore()

const myPosts = computed(() => posts.filter(p => p.user_id === currentUser.id))
const totalViews = computed(() => myPosts.value.reduce((acc, p) => acc + (p.view_count || 0), 0))
const totalClicks = computed(() => myPosts.value.reduce((acc, p) => acc + (p.link_clicks_count || 0), 0))
const totalLikes = computed(() => myPosts.value.reduce((acc, p) => acc + (p.like_count || 0), 0))
</script>

<style scoped>
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

.summary-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  display: flex;
  flex-direction: column;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-icon {
  font-size: 24px;
}

.metric-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-main);
}

.metric-title {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.top-posts-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
}

.table-responsive {
  overflow-x: auto;
}

.analytics-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}

.analytics-table th {
  padding: 10px 12px;
  border-bottom: 2px solid var(--border-color);
  color: var(--text-muted);
  font-weight: 700;
}

.analytics-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.content-cell {
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}

.text-danger { color: var(--danger-color); }
.text-primary { color: var(--primary-color); }
.text-success { color: var(--success-color); }
.text-warning { color: var(--warning-color); }
</style>
