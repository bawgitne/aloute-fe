<template>
  <aside class="sidebar-right">
    <!-- Trending Topics Widget -->
    <div class="card-social widget-card">
      <div class="widget-header">
        <h3><i class="fa-solid fa-fire text-warning"></i> Trending Topics</h3>
      </div>
      <div class="widget-body">
        <div
          v-for="topic in topics"
          :key="topic.id"
          class="topic-item"
          @click="selectTopic(topic.name)"
        >
          <div class="topic-info">
            <span class="topic-name">#{{ topic.name }}</span>
            <small class="topic-meta">{{ topic.post_count }} threads today</small>
          </div>
          <i class="fa-solid fa-chevron-right chevron-icon"></i>
        </div>
      </div>
    </div>

    <!-- Recommended Communities Widget -->
    <div class="card-social widget-card">
      <div class="widget-header">
        <h3><i class="fa-solid fa-users text-primary"></i> Communities for You</h3>
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

    <!-- Suggested Follows Widget -->
    <div class="card-social widget-card">
      <div class="widget-header">
        <h3><i class="fa-solid fa-user-plus text-success"></i> People to Follow</h3>
      </div>
      <div class="widget-body">
        <div
          v-for="usr in users"
          :key="usr.id"
          class="user-item"
        >
          <img :src="usr.avatar" class="avatar avatar-md" />
          <div class="user-info" @click="openProfile(usr)">
            <strong>{{ usr.display_name }}</strong>
            <small>@{{ usr.username }}</small>
          </div>
          <button
            class="btn-sm"
            :class="usr.is_following ? 'btn-outline' : 'btn-primary'"
            @click="usr.is_following ? unfollowUser(usr) : followUser(usr)"
          >
            {{ usr.is_following ? 'Following' : 'Follow' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Online Friends Chat Bar -->
    <div class="card-social widget-card">
      <div class="widget-header">
        <h3><i class="fa-solid fa-circle text-success font-10"></i> Active Conversations</h3>
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
  </aside>
</template>

<script setup>
import { useThreadsStore } from '@/composables/useThreadsStore'

const {
  topics,
  communities,
  users,
  conversations,
  activeTab,
  activeFeedFilter,
  selectedCommunity,
  selectedProfileUser,
  selectedConversation,
  isChatDrawerOpen,
  followUser,
  unfollowUser,
  joinCommunity,
  leaveCommunity
} = useThreadsStore()

function selectTopic(name) {
  activeFeedFilter.value = `topic_${name}`
  activeTab.value = 'feed'
}

function openCommunity(comm) {
  selectedCommunity.value = comm
  activeTab.value = 'community_detail'
}

function openProfile(usr) {
  selectedProfileUser.value = usr
  activeTab.value = 'profile'
}

function openChat(conv) {
  selectedConversation.value = conv
  isChatDrawerOpen.value = true
}
</script>

<style scoped>
.sidebar-right {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget-card {
  padding: 16px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.widget-header h3 {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-link {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
}

.widget-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.topic-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s ease;
}

.topic-item:hover {
  background: var(--bg-surface-secondary);
}

.topic-info {
  display: flex;
  flex-direction: column;
}

.topic-name {
  font-weight: 700;
  font-size: 13px;
  color: var(--text-main);
}

.topic-meta {
  font-size: 11px;
  color: var(--text-muted);
}

.chevron-icon {
  font-size: 11px;
  color: var(--text-light);
}

.community-item, .user-item, .chat-shortcut-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.community-info, .user-info, .chat-shortcut-info {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.community-info strong, .user-info strong, .chat-shortcut-info strong {
  display: block;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}

.community-info small, .user-info small {
  font-size: 11px;
  color: var(--text-muted);
}

.chat-shortcut-info p {
  font-size: 11px;
  color: var(--text-muted);
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-sm {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
}

.font-10 {
  font-size: 10px;
}

.text-warning { color: var(--warning-color); }
.text-primary { color: var(--primary-color); }
.text-success { color: var(--success-color); }

@media (max-width: 1200px) {
  .sidebar-right {
    display: none;
  }
}
</style>
