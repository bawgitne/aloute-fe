<template>
  <aside class="sidebar-right">
    <!-- Active Conversations Bar -->
    <div class="card-social widget-card">
      <div class="widget-header">
        <h3><i class="fa-solid fa-circle text-success font-10"></i> Active Conversations</h3>
        <button class="btn-link" @click="activeTab = 'messages'">Open DM</button>
      </div>
      <div class="widget-body">
        <div
          v-for="conv in conversations"
          :key="conv.id"
          class="chat-shortcut-item"
          @click="openChat(conv)"
        >
          <div class="avatar-wrapper">
            <img :src="conv.participant ? conv.participant.avatar : conv.group_avatar" class="avatar avatar-md" />
            <span v-if="conv.participant && conv.participant.online" class="avatar-online-dot"></span>
          </div>
          <div class="chat-shortcut-info">
            <strong>{{ conv.participant ? conv.participant.name : conv.group_name }}</strong>
            <p class="truncate">{{ conv.last_message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Communities Widget -->
    <div class="card-social widget-card">
      <div class="widget-header">
        <h3><i class="fa-solid fa-users text-primary"></i> Suggested Communities</h3>
        <button class="btn-link" @click="activeTab = 'communities'">See all</button>
      </div>
      <div class="widget-body">
        <div
          v-for="comm in communities"
          :key="comm.id"
          class="community-item"
        >
          <img :src="comm.avatar" class="avatar avatar-md" />
          <div class="community-info" @click="openCommunity(comm)">
            <strong>{{ comm.name }}</strong>
            <small>{{ comm.member_count }} members</small>
          </div>
          <button
            class="btn-sm"
            :class="comm.is_joined ? 'btn-outline' : 'btn-primary'"
            @click="comm.is_joined ? leaveCommunity(comm) : joinCommunity(comm)"
          >
            {{ comm.is_joined ? 'Joined' : 'Join' }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useThreadsStore } from '@/composables/useThreadsStore'

const {
  communities,
  conversations,
  activeTab,
  selectedCommunity,
  selectedConversation,
  isChatDrawerOpen,
  joinCommunity,
  leaveCommunity
} = useThreadsStore()

function openCommunity(comm) {
  selectedCommunity.value = comm
  activeTab.value = 'community_detail'
}

function openChat(conv) {
  selectedConversation.value = conv
  isChatDrawerOpen.value = true
}
</script>

<style scoped>
.sidebar-right {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget-card {
  padding: 14px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-color);
}

.widget-header h3 {
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-link {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 600;
}

.widget-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.community-item, .chat-shortcut-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.community-info, .chat-shortcut-info {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.community-info strong, .chat-shortcut-info strong {
  display: block;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
}

.community-info small, .chat-shortcut-info p {
  font-size: 10px;
  color: var(--text-muted);
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-sm {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
}

.font-10 { font-size: 10px; }
.text-primary { color: var(--primary-color); }
.text-success { color: var(--success-color); }

@media (max-width: 1200px) {
  .sidebar-right {
    display: none;
  }
}
</style>
