<template>
  <div v-if="isChatDrawerOpen" class="chat-drawer-container">
    <div class="chat-drawer card-social">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="chat-user-title">
          <img :src="convAvatar" class="avatar avatar-sm" />
          <div>
            <strong>{{ convTitle }}</strong>
            <small class="text-success"><i class="fa-solid fa-circle font-8"></i> Active</small>
          </div>
        </div>
        <button class="btn-icon btn-sm" @click="isChatDrawerOpen = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Messages Stream -->
      <div class="chat-messages-body" ref="messagesContainer">
        <div
          v-for="msg in selectedConversation.messages"
          :key="msg.id"
          class="chat-bubble-wrapper"
          :class="{ mine: msg.sender_id === currentUser.id }"
        >
          <div class="chat-bubble">
            <p>{{ msg.content }}</p>
            <div class="bubble-meta">
              <small>{{ msg.created_at }}</small>
              <div v-if="msg.reactions && msg.reactions.length" class="reactions-badge">
                <span v-for="(r, i) in msg.reactions" :key="i">{{ r }}</span>
              </div>
            </div>

            <!-- Emoji Reaction Picker Button -->
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
      <div class="chat-footer">
        <input
          type="text"
          v-model="inputMsg"
          placeholder="Type a message..."
          @keyup.enter="handleSend"
        />
        <button class="btn-primary btn-sm" :disabled="!inputMsg.trim()" @click="handleSend">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'

const {
  currentUser,
  selectedConversation,
  isChatDrawerOpen,
  sendMessage,
  addMessageReaction
} = useThreadsStore()

const inputMsg = ref('')
const messagesContainer = ref(null)

const convTitle = computed(() => {
  if (!selectedConversation.value) return 'Chat'
  return selectedConversation.value.participant
    ? selectedConversation.value.participant.name
    : selectedConversation.value.group_name
})

const convAvatar = computed(() => {
  if (!selectedConversation.value) return ''
  return selectedConversation.value.participant
    ? selectedConversation.value.participant.avatar
    : selectedConversation.value.group_avatar
})

function handleSend() {
  if (!inputMsg.value.trim() || !selectedConversation.value) return
  sendMessage(selectedConversation.value.id, inputMsg.value.trim())
  inputMsg.value = ''
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.chat-drawer-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 200;
}

.chat-drawer {
  width: 360px;
  height: 480px;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface);
}

.chat-user-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-user-title strong {
  font-size: 13px;
  display: block;
}

.chat-messages-body {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--bg-main);
}

.chat-bubble-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.chat-bubble-wrapper.mine {
  align-items: flex-end;
}

.chat-bubble {
  position: relative;
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  box-shadow: var(--shadow-sm);
}

.chat-bubble-wrapper.mine .chat-bubble {
  background: var(--primary-gradient);
  color: white;
  border: none;
}

.chat-bubble p {
  font-size: 13px;
  line-height: 1.4;
}

.bubble-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  gap: 8px;
}

.bubble-meta small {
  font-size: 10px;
  opacity: 0.8;
}

.reactions-badge {
  display: flex;
  gap: 2px;
  font-size: 11px;
  background: var(--bg-surface);
  padding: 1px 4px;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-sm);
}

.reaction-picker-menu {
  position: absolute;
  top: -24px;
  right: 0;
  display: none;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  padding: 2px 6px;
  gap: 4px;
  box-shadow: var(--shadow-sm);
}

.chat-bubble:hover .reaction-picker-menu {
  display: flex;
}

.reaction-picker-menu button {
  font-size: 12px;
}

.chat-footer {
  padding: 10px 12px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 8px;
  background: var(--bg-surface);
}

.chat-footer input {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color-darker);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 13px;
  outline: none;
}

.font-8 { font-size: 8px; }
</style>
