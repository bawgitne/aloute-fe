<template>
  <div
    class="multi-mini-chat-dock"
    :style="{ right: isChatDrawerOpen ? '338px' : '150px' }"
  >
    <div
      v-for="item in activeMiniChats"
      :key="item.id"
      class="mini-chat-box-wrapper"
    >
      <!-- Minimized Chat Head Pill -->
      <div
        v-if="item.isMinimized"
        class="chat-head-pill card-social"
        @click="toggleMinimizeMiniChat(item.id)"
        :title="`Open chat with ${getConvTitle(item.conv)}`"
      >
        <div class="avatar-relative">
          <img :src="getConvAvatar(item.conv)" class="avatar avatar-sm" />
          <span v-if="isConvOnline(item.conv)" class="online-dot"></span>
        </div>
        <span class="pill-name">{{ getConvTitle(item.conv) }}</span>
        <button class="btn-icon btn-xs close-pill-btn" @click.stop="closeMiniChat(item.id)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Expanded Facebook Mini Chat Window -->
      <div v-else class="facebook-mini-window card-social">
        <!-- Window Header -->
        <div class="window-header">
          <div class="header-partner-info" @click="toggleMinimizeMiniChat(item.id)">
            <div class="avatar-relative">
              <img :src="getConvAvatar(item.conv)" class="avatar avatar-xs" />
              <span v-if="isConvOnline(item.conv)" class="online-dot"></span>
            </div>
            <div class="partner-meta">
              <strong class="partner-name">{{ getConvTitle(item.conv) }}</strong>
              <small class="text-success"><i class="fa-solid fa-circle font-6"></i> Active now</small>
            </div>
          </div>

          <div class="header-window-actions">
            <button
              class="btn-icon btn-xs"
              @click="toggleMinimizeMiniChat(item.id)"
              title="Minimize"
            >
              <i class="fa-solid fa-minus"></i>
            </button>
            <button
              class="btn-icon btn-xs"
              @click="closeMiniChat(item.id)"
              title="Close Chat"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Window Messages Body -->
        <div class="window-messages-body" :ref="el => setStreamRef(item.id, el)">
          <div
            v-for="msg in item.conv.messages"
            :key="msg.id"
            class="mini-bubble-row"
            :class="{ mine: msg.sender_id === currentUser.id }"
          >
            <div class="mini-bubble">
              <p v-if="msg.content">{{ msg.content }}</p>
              <div v-if="msg.media_url || msg.media?.[0]?.url" class="mt-1 rounded-lg overflow-hidden max-h-28 bg-black">
                <img :src="msg.media_url || msg.media?.[0]?.url" class="max-h-28 object-contain w-full" />
              </div>

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

        <!-- Attachment Box -->
        <div v-if="showAttachments[item.id]" class="px-2 py-1.5 bg-gray-950 border-t border-gray-800 flex gap-1 items-center text-xs">
          <input type="text" v-model="mediaUrls[item.id]" placeholder="Dán URL ảnh/file..." class="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-[11px] text-white" />
          <button @click="showAttachments[item.id] = false" class="px-2 py-1 bg-indigo-600 rounded text-[10px] text-white font-bold">Xong</button>
        </div>

        <!-- Window Input Footer -->
        <div class="window-footer flex items-center gap-1">
          <button @click="showAttachments[item.id] = !showAttachments[item.id]" class="p-1 text-gray-400 hover:text-indigo-400" title="Đính kèm ảnh/file">
            <i class="fa-solid fa-paperclip"></i>
          </button>
          <div class="input-relative flex-1">
            <input
              type="text"
              v-model="inputTexts[item.id]"
              placeholder="Aa..."
              @keyup.enter="handleSend(item)"
            />
            <button
              class="embed-send-btn"
              :disabled="(!inputTexts[item.id] || !inputTexts[item.id].trim()) && (!mediaUrls[item.id] || !mediaUrls[item.id].trim())"
              @click="handleSend(item)"
              title="Send"
            >
              <i class="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick, watch } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const {
  currentUser,
  activeMiniChats,
  isChatDrawerOpen,
  closeMiniChat,
  toggleMinimizeMiniChat,
  sendMessage,
  addMessageReaction
} = useThreadsStore()

const inputTexts = reactive({})
const mediaUrls = reactive({})
const showAttachments = reactive({})
const streamRefs = reactive({})

function setStreamRef(id, el) {
  if (el) {
    streamRefs[id] = el
  }
}

function getConvTitle(conv) {
  if (!conv) return 'Chat'
  if (conv.type === 'DIRECT' && conv.participant) {
    return conv.participant.name
  }
  return conv.group_name || 'Group Chat'
}

function getConvAvatar(conv) {
  if (!conv) return ''
  if (conv.type === 'DIRECT' && conv.participant) {
    return conv.participant.avatar
  }
  return conv.group_avatar || currentUser.avatar
}

function isConvOnline(conv) {
  return conv && conv.type === 'DIRECT' && conv.participant && conv.participant.online
}

function handleSend(item) {
  const text = (inputTexts[item.id] || '').trim()
  const mediaUrl = (mediaUrls[item.id] || '').trim()
  if (!text && !mediaUrl) return
  sendMessage(item.id, text, { media_url: mediaUrl || null })
  inputTexts[item.id] = ''
  mediaUrls[item.id] = ''
  showAttachments[item.id] = false
  nextTick(() => {
    scrollToBottom(item.id)
  })
}

function scrollToBottom(id) {
  const container = streamRefs[id]
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

watch(
  () => activeMiniChats.value.map(c => ({ id: c.id, len: c.conv?.messages?.length })),
  () => {
    nextTick(() => {
      activeMiniChats.value.forEach(item => {
        scrollToBottom(item.id)
      })
    })
  },
  { deep: true }
)
</script>

<style scoped>
.multi-mini-chat-dock {
  position: fixed;
  bottom: 0;
  right: 20px;
  z-index: 1050;
  display: flex;
  flex-direction: row-reverse;
  gap: 12px;
  align-items: flex-end;
  pointer-events: none;
}

.mini-chat-box-wrapper {
  pointer-events: auto;
}

/* Chat Head Pill (Minimized) */
.chat-head-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  background: var(--bg-surface);
  border: 1px solid var(--border-color-darker);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  margin-bottom: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chat-head-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.pill-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-main);
  max-width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-pill-btn {
  font-size: 10px;
  width: 20px;
  height: 20px;
}

/* Facebook Mini Chat Window */
.facebook-mini-window {
  width: 310px;
  height: 440px;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  margin-bottom: 0;
  border-radius: 16px 16px 0 0;
  border: 1px solid var(--border-color-darker);
  border-bottom: none;
  background: var(--bg-surface);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.16);
  animation: popInWindow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popInWindow {
  from { opacity: 0; transform: translateY(30px) scale(0.92); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.header-partner-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.partner-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.partner-name {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-window-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-xs {
  width: 24px;
  height: 24px;
  font-size: 11px;
}

.avatar-xs {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

/* Messages Stream */
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

/* Window Footer Input */
.window-footer {
  padding: 8px 10px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-surface);
}

.input-relative {
  position: relative;
  display: flex;
  align-items: center;
}

.input-relative input {
  width: 100%;
  padding: 7px 32px 7px 12px;
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
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: var(--primary-color);
  font-size: 12px;
  border: none;
  cursor: pointer;
}

.embed-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.avatar-relative {
  position: relative;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: #10b981;
  border: 1.5px solid var(--bg-surface);
  border-radius: 50%;
}

.font-6 { font-size: 6px; }
</style>
