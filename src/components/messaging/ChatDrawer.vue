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
            v-if="store.chatDrawerSubView === 'chat'"
            class="btn-icon btn-sm"
            @click="store.chatDrawerSubView = 'list'"
            title="Back to Conversations"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </button>

          <!-- Header Title -->
          <div class="header-title-box">
            <template v-if="store.chatDrawerSubView === 'list'">
              <span class="header-user-handle">Tin nhắn (Direct Messages)</span>
            </template>
            <template v-else-if="store.selectedConversation">
              <div class="active-chat-partner">
                <img :src="convAvatar" class="avatar avatar-xs" />
                <div class="partner-meta">
                  <strong class="partner-name">{{ convTitle }}</strong>
                  <small class="text-success"><i class="fa-solid fa-circle font-6"></i> Đang hoạt động</small>
                </div>
              </div>
            </template>
          </div>

          <!-- Header Actions -->
          <div class="header-actions flex items-center gap-1">
            <button v-if="store.chatDrawerSubView === 'list'" @click="store.isCreateGroupChatModalOpen = true" class="btn-icon btn-sm text-indigo-400" title="Tạo nhóm chat">
              <i class="fa-solid fa-users-plus"></i>
            </button>
            <button class="btn-icon btn-sm" @click="store.isChatDrawerOpen = false" title="Minimize Panel">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Subview 1: Conversation List (IG Direct Inbox) -->
        <div v-if="store.chatDrawerSubView === 'list'" class="inbox-list-view">
          <!-- Search Bar -->
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm tin nhắn..."
            />
          </div>

          <!-- Active Online Friends Bar -->
          <div class="active-users-strip">
            <div
              v-for="user in store.users"
              :key="user.id"
              class="active-user-item cursor-pointer"
              @click="startChatWithUser(user)"
              title="Nhắn tin"
            >
              <div class="avatar-relative">
                <img :src="user.avatar" class="avatar avatar-sm" />
                <span class="online-dot"></span>
              </div>
              <span class="user-short-name">{{ (user.display_name || user.username).split(' ')[0] }}</span>
            </div>
          </div>

          <!-- Conversation Threads List -->
          <div class="conversations-scroll-body">
            <div
              v-for="conv in filteredConversations"
              :key="conv.id"
              class="conv-thread-item"
              :class="{ active: store.selectedConversation && store.selectedConversation.id === conv.id, unread: conv.unread_count > 0 }"
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
        <div v-else-if="store.chatDrawerSubView === 'chat' && store.selectedConversation" class="chat-thread-view">
          <!-- Messages Stream Body -->
          <div class="window-messages-body" ref="messagesContainer">
            <div
              v-for="msg in store.selectedConversation.messages"
              :key="msg.id"
              class="mini-bubble-row"
              :class="{ mine: msg.sender_id === store.currentUser.id }"
            >
              <div class="mini-bubble group relative">
                <!-- Reply-to context if any -->
                <div v-if="msg.reply_to" class="mb-1 p-1.5 rounded bg-black/30 border-l-2 border-indigo-500 text-[10px] text-gray-300">
                  <span class="font-bold text-indigo-400">Trả lời:</span> {{ msg.reply_to.content }}
                </div>

                <p>{{ msg.content }}</p>

                <!-- Media preview if any -->
                <div v-if="msg.media_url" class="mt-1 rounded-lg overflow-hidden max-h-32 bg-black">
                  <img :src="msg.media_url" class="max-h-32 object-contain" />
                </div>

                <div class="bubble-meta flex items-center justify-between gap-2">
                  <small>{{ msg.created_at }}</small>
                  <div v-if="msg.reactions && msg.reactions.length" class="reactions-badge">
                    <span v-for="(r, i) in msg.reactions" :key="i">{{ r }}</span>
                  </div>
                </div>

                <!-- Hover Actions: Reply & Emoji Reactions -->
                <div class="reaction-picker-menu">
                  <button @click="replyingToMessage = msg" title="Trả lời tin nhắn">↩️</button>
                  <button @click="store.addMessageReaction(msg, '❤️')">❤️</button>
                  <button @click="store.addMessageReaction(msg, '👍')">👍</button>
                  <button @click="store.addMessageReaction(msg, '🔥')">🔥</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Replying To Banner -->
          <div v-if="replyingToMessage" class="px-3 py-1.5 bg-gray-950 border-t border-indigo-500/40 flex justify-between items-center text-xs text-indigo-300">
            <span class="truncate">Đang trả lời: {{ replyingToMessage.content }}</span>
            <button @click="replyingToMessage = null" class="text-gray-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <!-- Attachment URL Box -->
          <div v-if="showAttachmentInput" class="px-3 py-2 bg-gray-950 border-t border-gray-800 flex gap-2">
            <input type="text" v-model="attachmentUrl" placeholder="Dán URL ảnh/file đính kèm..." class="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white" />
            <button @click="showAttachmentInput = false" class="px-2 py-1 bg-indigo-600 rounded text-xs text-white">Xong</button>
          </div>

          <!-- Chat Input Footer -->
          <div class="window-footer flex items-center gap-1">
            <button @click="showAttachmentInput = !showAttachmentInput" class="p-2 text-gray-400 hover:text-indigo-400" title="Đính kèm media">
              <i class="fa-solid fa-paperclip"></i>
            </button>
            <div class="input-relative flex-1">
              <input
                type="text"
                v-model="inputMsg"
                placeholder="Nhập tin nhắn..."
                @keyup.enter="handleSend"
              />
              <button
                class="embed-send-btn"
                :disabled="!inputMsg.trim() && !attachmentUrl.trim()"
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

const store = useThreadsStore()

const searchQuery = ref('')
const inputMsg = ref('')
const attachmentUrl = ref('')
const showAttachmentInput = ref(false)
const replyingToMessage = ref(null)
const messagesContainer = ref(null)

function toggleChatDrawer() {
  store.isChatDrawerOpen = !store.isChatDrawerOpen
  if (store.isChatDrawerOpen) {
    store.chatDrawerSubView = 'list'
  }
}

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return store.conversations
  const q = searchQuery.value.toLowerCase()
  return store.conversations.filter(c => {
    const title = getConvTitle(c).toLowerCase()
    const lastMsg = c.last_message ? c.last_message.toLowerCase() : ''
    return title.includes(q) || lastMsg.includes(q)
  })
})

const convTitle = computed(() => {
  if (!store.selectedConversation) return 'Chat'
  return getConvTitle(store.selectedConversation)
})

const convAvatar = computed(() => {
  if (!store.selectedConversation) return ''
  return getConvAvatar(store.selectedConversation)
})

function getConvTitle(conv) {
  if (conv.type === 'DIRECT' && conv.participant) {
    return conv.participant.display_name || conv.participant.name
  }
  return conv.group_name || 'Conversation'
}

function getConvAvatar(conv) {
  if (conv.type === 'DIRECT' && conv.participant) {
    return conv.participant.avatar
  }
  return conv.group_avatar || store.currentUser.avatar
}

function isConvOnline(conv) {
  return conv.type === 'DIRECT' && conv.participant && conv.participant.online
}

function openConversation(conv) {
  store.openConversation(conv.id)
}

function startChatWithUser(targetUser) {
  store.openMiniChat(targetUser)
}

function handleSend() {
  if ((!inputMsg.value.trim() && !attachmentUrl.value.trim()) || !store.selectedConversation) return
  store.sendMessage(store.selectedConversation.id, inputMsg.value.trim(), {
    reply_to: replyingToMessage.value ? { id: replyingToMessage.value.id, content: replyingToMessage.value.content } : null,
    media_url: attachmentUrl.value.trim() || null
  })
  inputMsg.value = ''
  attachmentUrl.value = ''
  showAttachmentInput.value = false
  replyingToMessage.value = null
  nextTick(() => {
    scrollToBottom()
  })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(() => store.selectedConversation?.messages.length, () => {
  nextTick(() => scrollToBottom())
})
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
