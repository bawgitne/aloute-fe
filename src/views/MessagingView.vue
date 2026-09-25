<template>
  <div class="messaging-view card-social">
    <!-- Conversation Sidebar -->
    <div class="conv-sidebar">
      <div class="conv-sidebar-header">
        <h3><i class="fa-solid fa-comments text-primary"></i> Direct Messages</h3>
      </div>

      <div class="conv-list">
        <div
          v-for="conv in store.conversations"
          :key="conv.id"
          class="conv-item"
          :class="{ active: store.selectedConversation && store.selectedConversation.id === conv.id }"
          @click="selectConv(conv)"
        >
          <div class="avatar-wrapper">
            <img :src="conv.participant ? conv.participant.avatar : conv.group_avatar" class="avatar avatar-md" />
            <span v-if="conv.participant && conv.participant.online" class="avatar-online-dot"></span>
          </div>

          <div class="conv-item-info">
            <div class="conv-title-row">
              <strong>{{ conv.participant ? conv.participant.name : conv.group_name }}</strong>
              <small class="conv-time">{{ conv.last_time }}</small>
            </div>
            <div class="conv-preview-row">
              <p class="truncate">{{ conv.last_message }}</p>
              <div class="item-actions-right">
                <button
                  v-if="store.commentDisplayMode === 'left_comments'"
                  class="btn-icon btn-xs popout-icon-btn"
                  @click.stop="store.openMiniChat(conv)"
                  title="Đẩy ra cửa sổ mini Facebook"
                >
                  <i class="fa-solid fa-up-right-from-square"></i>
                </button>
                <span v-if="conv.unread_count" class="badge badge-danger">{{ conv.unread_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Chat Thread -->
    <div v-if="store.selectedConversation" class="chat-thread-panel">
      <!-- Left Comments Mode Active Notification Banner -->
      <div v-if="store.commentDisplayMode === 'left_comments'" class="mini-popout-alert-bar">
        <div class="alert-info-text">
          <i class="fa-solid fa-comment-dots text-primary"></i>
          <span><strong>Chế độ Left Split:</strong> Cuộc trò chuyện đã đẩy ra cửa sổ mini Facebook ở góc màn hình!</span>
        </div>
        <button class="btn-sm btn-primary" @click="store.openMiniChat(store.selectedConversation)">
          <i class="fa-solid fa-up-right-from-square"></i> Mở Mini Chat
        </button>
      </div>

      <!-- Header -->
      <div class="thread-header">
        <div class="thread-user-info">
          <img :src="convAvatar" class="avatar avatar-md" />
          <div>
            <h3>{{ convTitle }}</h3>
            <small class="text-success"><i class="fa-solid fa-circle font-8"></i> Active now</small>
          </div>
        </div>
        <button
          v-if="store.commentDisplayMode === 'left_comments'"
          class="btn-outline btn-sm"
          @click="store.openMiniChat(store.selectedConversation)"
          title="Đẩy ra cửa sổ mini"
        >
          <i class="fa-solid fa-up-right-from-square"></i> Floating Window
        </button>
      </div>

      <!-- Messages Stream -->
      <div class="thread-messages-body" ref="messagesBody">
        <div
          v-for="msg in store.selectedConversation.messages"
          :key="msg.id"
          class="msg-bubble-row"
          :class="{ mine: msg.sender_id === store.currentUser.id }"
        >
          <div class="msg-bubble">
            <p>{{ msg.content }}</p>
            <div class="msg-meta">
              <small>{{ msg.created_at }}</small>
              <div v-if="msg.reactions && msg.reactions.length" class="reactions-badge">
                <span v-for="(r, i) in msg.reactions" :key="i">{{ r }}</span>
              </div>
            </div>

            <!-- Reaction Menu -->
            <div class="reaction-menu">
              <button @click="store.addMessageReaction(msg, '❤️')">❤️</button>
              <button @click="store.addMessageReaction(msg, '👍')">👍</button>
              <button @click="store.addMessageReaction(msg, '🔥')">🔥</button>
              <button @click="store.addMessageReaction(msg, '🚀')">🚀</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="thread-input-bar">
        <input
          type="text"
          v-model="inputText"
          placeholder="Write a message..."
          @keyup.enter="send"
        />
        <button class="btn-primary" :disabled="!inputText.trim()" @click="send">
          <i class="fa-solid fa-paper-plane"></i> Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const store = useThreadsStore()

const inputText = ref('')
const messagesBody = ref(null)

function selectConv(conv) {
  store.selectedConversation = conv
  if (store.commentDisplayMode === 'left_comments') {
    store.openMiniChat(conv)
  }
}

const convTitle = computed(() => {
  if (!store.selectedConversation) return ''
  return store.selectedConversation.participant
    ? store.selectedConversation.participant.name
    : store.selectedConversation.group_name
})

const convAvatar = computed(() => {
  if (!store.selectedConversation) return ''
  return store.selectedConversation.participant
    ? store.selectedConversation.participant.avatar
    : store.selectedConversation.group_avatar
})

function send() {
  if (!inputText.value.trim() || !store.selectedConversation) return
  store.sendMessage(store.selectedConversation.id, inputText.value.trim())
  inputText.value = ''
  nextTick(() => {
    if (messagesBody.value) {
      messagesBody.value.scrollTop = messagesBody.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.messaging-view {
  display: flex;
  height: 650px;
  padding: 0;
  overflow: hidden;
}

.conv-sidebar {
  width: 320px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.conv-sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.conv-sidebar-header h3 {
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.conv-list {
  flex: 1;
  overflow-y: auto;
}

.conv-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background 0.2s ease;
}

.conv-item:hover, .conv-item.active {
  background: var(--bg-surface-secondary);
}

.conv-item-info {
  flex: 1;
  min-width: 0;
}

.conv-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conv-title-row strong {
  font-size: 13px;
}

.conv-time {
  font-size: 10px;
  color: var(--text-light);
}

.conv-preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-preview-row p {
  font-size: 12px;
  color: var(--text-muted);
}

.chat-thread-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-main);
}

.thread-header {
  padding: 14px 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}

.thread-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thread-user-info h3 {
  font-size: 15px;
  font-weight: 700;
}

.thread-messages-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.msg-bubble-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.msg-bubble-row.mine {
  align-items: flex-end;
}

.msg-bubble {
  position: relative;
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.msg-bubble-row.mine .msg-bubble {
  background: var(--primary-gradient);
  color: white;
  border: none;
}

.msg-bubble p {
  font-size: 14px;
  line-height: 1.4;
}

.msg-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  gap: 10px;
}

.msg-meta small {
  font-size: 10px;
  opacity: 0.8;
}

.reactions-badge {
  display: flex;
  gap: 2px;
  background: var(--bg-surface);
  padding: 2px 6px;
  border-radius: var(--radius-pill);
  font-size: 11px;
}

.reaction-menu {
  position: absolute;
  top: -26px;
  right: 0;
  display: none;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  padding: 2px 8px;
  gap: 6px;
}

.msg-bubble:hover .reaction-menu {
  display: flex;
}

.thread-input-bar {
  padding: 14px 20px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 12px;
}

.thread-input-bar input {
  flex: 1;
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 14px;
  outline: none;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-popout-alert-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(80, 181, 255, 0.1);
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
}

.alert-info-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
}

.item-actions-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.popout-icon-btn {
  width: 26px;
  height: 26px;
  font-size: 10px;
}

.thread-header {
  padding: 14px 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.font-8 { font-size: 8px; }
.text-success { color: var(--success-color); }
</style>
