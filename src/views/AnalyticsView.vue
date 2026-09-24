<template>
  <div class="analytics-view space-y-6 max-w-4xl mx-auto">
    <div class="card-social page-header">
      <h2><i class="fa-solid fa-chart-line text-primary"></i> Phân Tích Thống Kê Tài Khoản & Bài Viết</h2>
      <p class="text-muted">Chỉ số hiệu suất thời gian thực dựa trên lượt tương tác, lượt xem và chuyển đổi.</p>
    </div>

    <!-- Summary Metric Cards Grid -->
    <div class="summary-metrics-grid">
      <div class="card-social metric-card">
        <div class="metric-header">
          <i class="fa-solid fa-eye text-primary metric-icon"></i>
          <span class="badge badge-success">+18% tuần này</span>
        </div>
        <div class="metric-value">{{ totalViews.toLocaleString() }}</div>
        <div class="metric-title">Tổng Lượt Xem</div>
      </div>

      <div class="card-social metric-card">
        <div class="metric-header">
          <i class="fa-solid fa-arrow-pointer text-success metric-icon"></i>
          <span class="badge badge-primary">+24%</span>
        </div>
        <div class="metric-value">{{ totalClicks.toLocaleString() }}</div>
        <div class="metric-title">Lượt Click Link</div>
      </div>

      <div class="card-social metric-card">
        <div class="metric-header">
          <i class="fa-solid fa-heart text-danger metric-icon"></i>
          <span class="badge badge-warning">+12%</span>
        </div>
        <div class="metric-value">{{ totalLikes.toLocaleString() }}</div>
        <div class="metric-title">Tổng Lượt Thích</div>
      </div>

      <div class="card-social metric-card">
        <div class="metric-header">
          <i class="fa-solid fa-bolt text-warning metric-icon"></i>
          <span class="badge badge-success">Thực tế</span>
        </div>
        <div class="metric-value text-indigo-400">{{ calculatedEngagementRate }}</div>
        <div class="metric-title">Tỷ Lệ Tương Tác (Engagement)</div>
      </div>
    </div>

    <!-- Top Performing Posts Table -->
    <div class="card-social top-posts-card">
      <h3 class="flex items-center gap-2">
        <i class="fa-solid fa-trophy text-amber-400"></i> Bài Viết Hiệu Suất Cao Nhất (Ranked)
      </h3>
      <div class="table-responsive mt-3">
        <table class="analytics-table">
          <thead>
            <tr>
              <th>Nội dung bài viết</th>
              <th>Thời gian</th>
              <th>Lượt xem</th>
              <th>Lượt thích</th>
              <th>Phản hồi</th>
              <th>Click link</th>
              <th>Điểm ranking</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(post, index) in rankedPosts" :key="post.id">
              <td class="content-cell flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">{{ index + 1 }}</span>
                <span class="truncate max-w-xs">"{{ post.content }}"</span>
              </td>
              <td>{{ post.created_at }}</td>
              <td><strong>{{ post.view_count || 0 }}</strong></td>
              <td>{{ post.like_count || 0 }}</td>
              <td>{{ post.reply_count || 0 }}</td>
              <td><span class="badge badge-primary">{{ post.link_clicks_count || 0 }}</span></td>
              <td><span class="text-xs font-extrabold text-indigo-400">{{ post.score.toFixed(0) }} pts</span></td>
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

const store = useThreadsStore()

const allPosts = computed(() => store.posts || [])
const totalViews = computed(() => allPosts.value.reduce((acc, p) => acc + (p.view_count || 0), 0))
const totalClicks = computed(() => allPosts.value.reduce((acc, p) => acc + (p.link_clicks_count || 0), 0))
const totalLikes = computed(() => allPosts.value.reduce((acc, p) => acc + (p.like_count || 0), 0))
const totalReplies = computed(() => allPosts.value.reduce((acc, p) => acc + (p.reply_count || 0), 0))
const totalReposts = computed(() => allPosts.value.reduce((acc, p) => acc + (p.repost_count || 0), 0))

const calculatedEngagementRate = computed(() => {
  const interactions = totalLikes.value + totalReplies.value + totalReposts.value
  const views = Math.max(1, totalViews.value)
  const rate = (interactions / views) * 100
  return rate.toFixed(1) + '%'
})

const rankedPosts = computed(() => {
  return [...allPosts.value]
    .map(p => {
      const score = (p.like_count || 0) * 2 + (p.reply_count || 0) * 3 + (p.repost_count || 0) * 4 + (p.view_count || 0) * 0.05
      return { ...p, score }
    })
    .sort((a, b) => b.score - a.score)
})
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
