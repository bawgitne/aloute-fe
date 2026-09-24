<template>
  <div class="ig-chat-widget-wrapper">
    <!-- White Floating Launcher Button Pinned to Bottom Right -->
    <button
      class="floating-chat-trigger-btn"
      :class="{ 'hidden-launcher': isChatDrawerOpen }"
      @click="toggleChatDrawer"
      title="Messages"
    >
      <div class="icon-box">
        <i class="fa-regular fa-paper-plane text-dark-icon"></i>
        <span v-if="totalUnreadCount > 0" class="floating-unread-badge">
          {{ totalUnreadCount }}
        </span>
      </div>
      <span class="btn-label">Messages</span>
    </button>

    <!-- Instagram-Style Direct Message Pop-up Drawer (Super-Fast Expansion from Bottom Right) -->
    <transition name="ig-expand">
      <div v-if="isChatDrawerOpen" class="ig-chat-drawer card-social">
        <!-- Drawer Header -->
        <div class="drawer-header">
          <!-- Back button if in active chat subview -->
          <button
            v-if="chatDrawerSubView === 'chat'"
            class="btn-icon btn-sm"
            @click="chatDrawerSubView = 'list'"
            title="Back to Conversations"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </button>

          <!-- Header Title -->
          <div class="header-title-box">
            <template v-if="chatDrawerSubView === 'list'">
              <span class="header-user-handle">Direct Messages</span>
            </template>
            <template v-else-if="selectedConversation">
              <div class="active-chat-partner">
                <img :src="convAvatar" class="avatar avatar-xs" />
                <div class="partner-meta">
                  <strong class="partner-name">{{ convTitle }}</strong>
                  <small class="text-success"><i class="fa-solid fa-circle font-6"></i> Active now</small>
                </div>
              </div>
            </template>
          </div>

          <!-- Header Actions -->
          <div class="header-actions">
            <button class="btn-icon btn-sm" @click="isChatDrawerOpen = false" title="Minimize Panel">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Subview 1: Conversation List (IG Direct Inbox) -->
        <div v-if="chatDrawerSubView === 'list'" class="inbox-list-view">
          <!-- Search Bar -->
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search messages..."
            />
          </div>

          <!-- Active Online Friends Bar -->
          <div class="active-users-strip">
            <div
              v-for="user in users"
              :key="user.id"
              class="active-user-item"
              @click="startChatWithUser(user)"
              title="Message user"
            >
              <div class="avatar-relative">
                <img :src="user.avatar" class="avatar avatar-sm" />
                <span class="online-dot"></span>
              </div>
              <span class="user-short-name">{{ user.display_name.split(' ')[0] }}</span>
            </div>
          </div>

          <!-- Conversation Threads List -->
          <div class="conversations-scroll-body">
            <div
              v-for="conv in filteredConversations"
              :key="conv.id"
              class="conv-thread-item"
              :class="{ active: selectedConversation && selectedConversation.id === conv.id, unread: conv.unread_count > 0 }"
              @click="openConversation(conv)"
            >
              <div class="avatar-relative">
                <img :src="getConvAvatar(conv)" class="avatar avatar-md" />
                <span v-if="isConvOnline(conv)" class="online-dot"></span>
              </div>

              <div class="conv-details">
                <div class="conv-top-row">
                  <strong class="conv-name">{{ getConvTitle(conv) }}</strong>
                  <span class="conv-time">{{ conv.last_time }}</span>
                </div>
                <div class="conv-bottom-row">
                  <p class="last-msg-preview" :class="{ unread: conv.unread_count > 0 }">
                    {{ conv.last_message }}
                  </p>
                  <span v-if="conv.unread_count > 0" class="unread-count-pill">
                    {{ conv.unread_count }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Subview 2: Active Chat Thread View -->
        <div v-else-if="chatDrawerSubView === 'chat' && selectedConversation" class="chat-thread-view">
          <!-- Messages Stream Body -->
          <div class="window-messages-body" ref="messagesContainer">
            <div
              v-for="msg in selectedConversation.messages"
              :key="msg.id"
              class="mini-bubble-row"
              :class="{ mine: msg.sender_id === currentUser.id }"
            >
              <div class="mini-bubble">
                <p>{{ msg.content }}</p>
                <div class="bubble-meta">
                  <small>{{ msg.created_at }}</small>
                  <div v-if="msg.reactions && msg.reactions.length" class="reactions-badge">
                    <span v-for="(r, i) in msg.reactions" :key="i">{{ r }}</span>
                  </div>
                </div>

                <!-- Hover Emoji Reaction Menu -->
                <div class="reaction-picker-menu">
                  <button @click="addMessageReaction(msg, '❤️')">❤️</button>
                  <button @click="addMessageReaction(msg, '👍')">👍</button>
                  <button @click="addMessageReaction(msg, '🔥')">🔥</button>
                  <button @click="addMessageReaction(msg, '🚀')">🚀</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Input Footer -->
          <div class="window-footer">
            <div class="input-relative">
              <input
                type="text"
                v-model="inputMsg"
                placeholder="Aa..."
                @keyup.enter="handleSend"
              />
              <button
                class="embed-send-btn"
                :disabled="!inputMsg.trim()"
                @click="handleSend"
                title="Send Message"
              >
                <i class="fa-regular fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const {
  currentUser,
  users,
  conversations,
  selectedConversation,
  isChatDrawerOpen,
  chatDrawerSubView,
  totalUnreadCount,
  sendMessage,
  addMessageReaction,
  openMiniChat
} = useThreadsStore()

const searchQuery = ref('')
const inputMsg = ref('')
const messagesContainer = ref(null)

function toggleChatDrawer() {
  isChatDrawerOpen.value = !isChatDrawerOpen.value
  if (isChatDrawerOpen.value) {
    chatDrawerSubView.value = 'list'
  }
}

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return conversations
  const q = searchQuery.value.toLowerCase()
  return conversations.filter(c => {
    const title = getConvTitle(c).toLowerCase()
    const lastMsg = c.last_message ? c.last_message.toLowerCase() : ''
    return title.includes(q) || lastMsg.includes(q)
  })
})

const convTitle = computed(() => {
  if (!selectedConversation.value) return 'Chat'
  return getConvTitle(selectedConversation.value)
})

const convAvatar = computed(() => {
  if (!selectedConversation.value) return ''
  return getConvAvatar(selectedConversation.value)
})

function getConvTitle(conv) {
  if (conv.type === 'DIRECT' && conv.participant) {
    return conv.participant.name
  }
  return conv.group_name || 'Conversation'
}

function getConvAvatar(conv) {
  if (conv.type === 'DIRECT' && conv.participant) {
    return conv.participant.avatar
  }
  return conv.group_avatar || currentUser.avatar
}

function isConvOnline(conv) {
  return conv.type === 'DIRECT' && conv.participant && conv.participant.online
}

function openConversation(conv) {
  selectedConversation.value = conv
  conv.unread_count = 0 // Clear unread when opened
  openMiniChat(conv)
}

function startChatWithUser(targetUser) {
  let existing = conversations.find(
    c => c.type === 'DIRECT' && c.participant && c.participant.id === targetUser.id
  )
  if (!existing) {
    existing = {
      id: `conv_${Date.now()}`,
      type: 'DIRECT',
      participant: {
        id: targetUser.id,
        name: targetUser.display_name,
        username: targetUser.username,
        avatar: targetUser.avatar,
        online: true
      },
      unread_count: 0,
      last_message: 'Started a new conversation',
      last_time: 'Just now',
      messages: []
    }
    conversations.unshift(existing)
  }
  openConversation(existing)
}

function handleSend() {
  if (!inputMsg.value.trim() || !selectedConversation.value) return
  sendMessage(selectedConversation.value.id, inputMsg.value.trim())
  inputMsg.value = ''
  nextTick(() => {
    scrollToBottom()
  })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.ig-chat-widget-wrapper {
  position: fixed;
  bottom: 0;
  right: 20px;
  z-index: 1060;
  pointer-events: none;
}

/* White Floating Launcher Button */
.floating-chat-trigger-btn {
  pointer-events: auto;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: var(--bg-surface);
  color: var(--text-main);
  border: 1px solid var(--border-color-darker);
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  transition: transform 0.18s ease, opacity 0.15s ease, box-shadow 0.18s ease;
}

.floating-chat-trigger-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border-color: var(--primary-color);
}

.floating-chat-trigger-btn.hidden-launcher {
  opacity: 0;
  transform: scale(0.6);
  pointer-events: none;
}

.icon-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.text-dark-icon {
  color: var(--text-main);
}

.floating-unread-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: var(--danger-color);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
}

.btn-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: var(--text-main);
}

/* Bottom Docked Messages Drawer */
.ig-chat-drawer {
  pointer-events: auto;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 0;
  width: 310px;
  height: 440px;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.16);
  border: 1px solid var(--border-color-darker);
  border-bottom: none;
  border-radius: 16px 16px 0 0;
  background: var(--bg-surface);
  transform-origin: bottom right;
  z-index: 1061;
}

/* Drawer Header */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface);
}

.header-title-box {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-user-handle {
  font-weight: 800;
  font-size: 14px;
  color: var(--text-main);
}

.active-chat-partner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.partner-meta {
  display: flex;
  flex-direction: column;
}

.partner-name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Inbox List View */
.inbox-list-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.search-box {
  position: relative;
  margin: 10px 14px 6px 14px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--text-muted);
}

.search-box input {
  width: 100%;
  padding: 7px 12px 7px 32px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 12px;
  outline: none;
}

.search-box input:focus {
  border-color: var(--primary-color);
}

.active-users-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  overflow-x: auto;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
}

.active-user-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-relative {
  position: relative;
}

.online-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 9px;
  height: 9px;
  background: #10b981;
  border: 2px solid var(--bg-surface);
  border-radius: 50%;
}

.user-short-name {
  font-size: 10px;
  color: var(--text-muted);
  max-width: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversations-scroll-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.conv-thread-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid var(--border-color);
}

.conv-thread-item:hover, .conv-thread-item.active {
  background: var(--bg-surface-secondary);
}

.conv-thread-item.unread {
  background: rgba(var(--primary-color-rgb, 79, 70, 229), 0.05);
}

.conv-details {
  flex: 1;
  min-width: 0;
}

.conv-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.conv-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-time {
  font-size: 10px;
  color: var(--text-light);
}

.conv-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-msg-preview {
  font-size: 11px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.last-msg-preview.unread {
  font-weight: 700;
  color: var(--text-main);
}

.unread-count-pill {
  background: var(--primary-color);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: var(--radius-pill);
}

/* Chat Thread View */
.chat-thread-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.window-messages-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--bg-main);
}

.mini-bubble-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.mini-bubble-row.mine {
  align-items: flex-end;
}

.mini-bubble {
  position: relative;
  max-width: 84%;
  padding: 8px 12px;
  border-radius: 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  box-shadow: var(--shadow-sm);
}

.mini-bubble-row.mine .mini-bubble {
  background: var(--primary-gradient);
  color: #ffffff;
  border: none;
}

.mini-bubble p {
  font-size: 12px;
  line-height: 1.35;
  word-break: break-word;
}

.bubble-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
  gap: 4px;
}

.bubble-meta small {
  font-size: 9px;
  opacity: 0.75;
}

.reactions-badge {
  display: flex;
  gap: 2px;
  font-size: 9px;
  background: var(--bg-surface);
  padding: 1px 4px;
  border-radius: var(--radius-pill);
}

.reaction-picker-menu {
  position: absolute;
  top: -24px;
  right: 0;
  display: none;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  padding: 2px 4px;
  gap: 4px;
}

.mini-bubble:hover .reaction-picker-menu {
  display: flex;
}

.reaction-picker-menu button {
  font-size: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.window-footer {
  padding: 8px 10px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-surface);
}

.btn-xs {
  width: 24px;
  height: 24px;
  font-size: 11px;
}

.input-relative {
  position: relative;
  display: flex;
  align-items: center;
}

.input-relative input {
  width: 100%;
  padding: 8px 36px 8px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 12px;
  outline: none;
}

.input-relative input:focus {
  border-color: var(--primary-color);
}

.embed-send-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: var(--primary-color);
  font-size: 13px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;
}

.embed-send-btn:disabled {
  color: var(--text-light);
  opacity: 0.4;
  cursor: not-allowed;
}

.embed-send-btn:not(:disabled):hover {
  color: var(--primary-hover);
  transform: translateY(-50%) scale(1.12);
}

.font-6 { font-size: 6px; }

/* Hyper-Fast Expansion Animation (0.2s duration) */
.ig-expand-enter-active {
  animation: expandBoxFast 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.ig-expand-leave-active {
  animation: shrinkBoxFast 0.16s cubic-bezier(0.4, 0, 1, 1) forwards;
}

.ig-expand-enter-active .inbox-list-view,
.ig-expand-enter-active .chat-thread-view {
  animation: contentFastFadeIn 0.15s ease 0.05s both;
}

@keyframes expandBoxFast {
  0% {
    opacity: 0;
    transform: scale(0.3) translate(30px, 30px);
    border-radius: 35px;
  }
  100% {
    opacity: 1;
    transform: scale(1) translate(0, 0);
    border-radius: 20px;
  }
}

@keyframes shrinkBoxFast {
  0% {
    opacity: 1;
    transform: scale(1) translate(0, 0);
    border-radius: 20px;
  }
  100% {
    opacity: 0;
    transform: scale(0.3) translate(30px, 30px);
    border-radius: 35px;
  }
}

@keyframes contentFastFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
