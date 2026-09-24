<template>
  <div v-if="poll" class="poll-widget card-social">
    <div class="poll-question">
      <i class="fa-solid fa-square-poll-vertical poll-icon"></i>
      <span>{{ poll.question }}</span>
    </div>
    
    <div class="poll-options">
      <div
        v-for="option in poll.options"
        :key="option.id"
        class="poll-option-item"
        :class="{
          selected: isOptionSelected(option.id),
          voted: hasVoted
        }"
        @click="handleVote(option.id)"
      >
        <div class="option-progress-bg" :style="{ width: getPercentage(option.vote_count) + '%' }"></div>
        <div class="option-content">
          <div class="option-left">
            <span class="radio-indicator">
              <i v-if="isOptionSelected(option.id)" class="fa-solid fa-square-check text-indigo-400"></i>
              <i v-else class="fa-regular fa-square"></i>
            </span>
            <span class="option-text">{{ option.text }}</span>
          </div>
          <span v-if="hasVoted" class="option-percent">
            {{ getPercentage(option.vote_count) }}%
          </span>
        </div>
      </div>
    </div>

    <div class="poll-meta">
      <small>{{ poll.total_votes }} lượt bình chọn</small>
      <small class="single-choice-badge">
        <i class="fa-solid" :class="poll.allow_multiple ? 'fa-square-check text-indigo-400' : 'fa-lock'"></i>
        {{ poll.allow_multiple ? 'Cho phép chọn nhiều' : 'Lựa chọn duy nhất' }}
      </small>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const props = defineProps({
  post: { type: Object, required: true }
})

const { votePoll } = useThreadsStore()
const poll = computed(() => props.post.poll).value

const hasVoted = computed(() => {
  if (!poll) return false
  return !!poll.user_voted_option_id || (poll.user_voted_option_ids && poll.user_voted_option_ids.length > 0)
})

function isOptionSelected(optionId) {
  if (!poll) return false
  if (poll.user_voted_option_id === optionId) return true
  return poll.user_voted_option_ids && poll.user_voted_option_ids.includes(optionId)
}

function getPercentage(voteCount) {
  if (!poll || !poll.total_votes) return 0
  return Math.round((voteCount / poll.total_votes) * 100)
}

function handleVote(optionId) {
  votePoll(props.post, optionId)
}
</script>

<style scoped>
.poll-widget {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  padding: 14px;
  margin: 12px 0;
  border-radius: var(--radius-sm);
}

.poll-question {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 12px;
}

.poll-icon {
  color: var(--primary-color);
}

.poll-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.poll-option-item {
  position: relative;
  border: 1px solid var(--border-color-darker);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease;
  background: var(--bg-surface);
}

.poll-option-item:hover {
  border-color: var(--primary-color);
}

.poll-option-item.selected {
  border-color: var(--primary-color);
  background: rgba(80, 181, 255, 0.05);
}

.option-progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(80, 181, 255, 0.18);
  transition: width 0.4s ease;
  z-index: 1;
}

.option-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.option-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radio-indicator {
  color: var(--primary-color);
  font-size: 15px;
}

.option-text {
  font-weight: 600;
  font-size: 13px;
}

.option-percent {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-color);
}

.poll-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 11px;
}

.single-choice-badge {
  color: var(--text-light);
}
</style>
