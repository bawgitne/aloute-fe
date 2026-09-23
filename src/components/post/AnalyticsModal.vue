<template>
  <div v-if="isAnalyticsModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fa-solid fa-chart-line text-primary"></i> Thread Analytics</h3>
        <button class="btn-icon btn-sm" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div v-if="analyticsTargetPost" class="modal-body">
        <div class="post-preview-snippet">
          <p class="truncate-preview">"{{ analyticsTargetPost.content }}"</p>
          <small class="text-muted">Posted {{ analyticsTargetPost.created_at }}</small>
        </div>

        <div class="analytics-grid">
          <div class="stat-card">
            <i class="fa-solid fa-eye text-primary"></i>
            <div class="stat-value">{{ analyticsTargetPost.view_count || 1240 }}</div>
            <div class="stat-title">Total Views</div>
          </div>

          <div class="stat-card">
            <i class="fa-solid fa-arrow-pointer text-success"></i>
            <div class="stat-value">{{ analyticsTargetPost.link_clicks_count || 85 }}</div>
            <div class="stat-title">Link Clicks</div>
          </div>

          <div class="stat-card">
            <i class="fa-solid fa-heart text-danger"></i>
            <div class="stat-value">{{ analyticsTargetPost.like_count }}</div>
            <div class="stat-title">Likes Received</div>
          </div>

          <div class="stat-card">
            <i class="fa-solid fa-retweet text-warning"></i>
            <div class="stat-value">{{ analyticsTargetPost.repost_count + analyticsTargetPost.quote_count }}</div>
            <div class="stat-title">Reposts & Quotes</div>
          </div>
        </div>

        <div class="engagement-breakdown card-social">
          <h4>Engagement Performance</h4>
          <div class="progress-bar-group">
            <div class="progress-label">
              <span>Engagement Rate</span>
              <strong>{{ calculateEngagement() }}%</strong>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: calculateEngagement() * 5 + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useThreadsStore } from '@/composables/useThreadsStore'

const { isAnalyticsModalOpen, analyticsTargetPost } = useThreadsStore()

function closeModal() {
  isAnalyticsModalOpen.value = false
}

function calculateEngagement() {
  if (!analyticsTargetPost.value) return 4.2
  const totalEng = (analyticsTargetPost.value.like_count || 0) +
                   (analyticsTargetPost.value.reply_count || 0) +
                   (analyticsTargetPost.value.repost_count || 0)
  const views = analyticsTargetPost.value.view_count || 100
  return ((totalEng / views) * 100).toFixed(1)
}
</script>

<style scoped>
.post-preview-snippet {
  background: var(--bg-surface-secondary);
  padding: 12px;
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--primary-color);
  margin-bottom: 16px;
}

.truncate-preview {
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 14px;
  text-align: center;
}

.stat-card i {
  font-size: 20px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-main);
}

.stat-title {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.engagement-breakdown {
  padding: 14px;
}

.engagement-breakdown h4 {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
}

.progress-bar-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.progress-bar {
  height: 8px;
  background: var(--bg-surface-secondary);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: var(--radius-pill);
}
</style>
