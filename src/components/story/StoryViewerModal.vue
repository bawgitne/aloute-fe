<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useThreadsStore } from '../../composables/useThreadsStore'

const store = useThreadsStore()
const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'

const currentIndex = ref(0)
const progress = ref(0)
let timer = null

const activeStories = computed(() => store.activeStoryGroup?.items || [])
const currentStory = computed(() => activeStories.value[currentIndex.value] || null)

const getMediaUrl = (story) => {
  if (!story) return ''
  return story.media_url || story.mediaUrl || ''
}

const getMediaType = (story) => {
  if (!story) return 'IMAGE'
  return story.media_type || story.type || 'IMAGE'
}

const currentGroupIndex = computed(() => {
  if (!store.activeStoryGroup) return -1
  return store.stories.findIndex(g => g.id === store.activeStoryGroup.id)
})

const startProgress = () => {
  clearInterval(timer)
  progress.value = 0
  timer = setInterval(() => {
    progress.value += 2
    if (progress.value >= 100) {
      nextStory()
    }
  }, 100)
}

const nextStory = () => {
  if (currentIndex.value < activeStories.value.length - 1) {
    currentIndex.value++
    startProgress()
  } else {
    // Switch to next user story group if available
    const gIdx = currentGroupIndex.value
    if (gIdx >= 0 && gIdx < store.stories.length - 1) {
      store.activeStoryGroup = store.stories[gIdx + 1]
      currentIndex.value = 0
      startProgress()
    } else {
      handleClose()
    }
  }
}

const prevStory = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    startProgress()
  } else {
    // Switch to previous user story group if available
    const gIdx = currentGroupIndex.value
    if (gIdx > 0) {
      const prevGroup = store.stories[gIdx - 1]
      store.activeStoryGroup = prevGroup
      currentIndex.value = Math.max(0, (prevGroup.items?.length || 1) - 1)
      startProgress()
    }
  }
}

watch(() => store.activeStoryGroup, (newGroup) => {
  if (newGroup && newGroup.items?.length > 0) {
    currentIndex.value = 0
    startProgress()
  }
}, { immediate: true })

onUnmounted(() => {
  clearInterval(timer)
})

const handleClose = () => {
  clearInterval(timer)
  store.isStoryViewerOpen = false
  store.activeStoryGroup = null
}

const replyText = ref('')
const handleSendReply = () => {
  if (!replyText.value.trim() || !store.activeStoryGroup?.user) return
  const targetUser = store.activeStoryGroup.user
  store.openMiniChat(targetUser)
  const conv = store.selectedConversation
  if (conv) {
    store.sendMessage(conv.id, `Trả lời Story: ${replyText.value.trim()}`)
  }
  replyText.value = ''
}
</script>

<template>
  <div v-if="store.isStoryViewerOpen && store.activeStoryGroup" class="modal-overlay" @click.self="handleClose">
    <!-- Close button -->
    <button @click="handleClose" class="absolute top-6 right-6 z-30 p-2 rounded-full bg-gray-800/80 text-white hover:bg-gray-700 transition">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <!-- Main Container -->
    <div class="relative w-full max-w-sm h-[85vh] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col">
      <!-- Progress bars -->
      <div class="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
        <div
          v-for="(story, idx) in activeStories"
          :key="story.id || idx"
          class="flex-1 h-1 bg-gray-700/80 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-white transition-all duration-100 ease-linear"
            :style="{ width: idx < currentIndex ? '100%' : idx === currentIndex ? progress + '%' : '0%' }"
          ></div>
        </div>
      </div>

      <!-- User Header -->
      <div v-if="store.activeStoryGroup?.user" class="absolute top-6 left-4 right-4 z-20 flex items-center gap-3">
        <img :src="store.activeStoryGroup.user.avatar || defaultAvatar" class="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover" />
        <div class="text-white drop-shadow">
          <p class="font-bold text-sm leading-tight">{{ store.activeStoryGroup.user.display_name || store.activeStoryGroup.user.name }}</p>
          <p class="text-xs text-gray-300">@{{ store.activeStoryGroup.user.username }}</p>
        </div>
      </div>

      <!-- Story Content -->
      <div class="flex-1 relative flex items-center justify-center bg-black">
        <template v-if="currentStory">
          <!-- Video Story -->
          <video
            v-if="getMediaType(currentStory) === 'VIDEO'"
            :src="getMediaUrl(currentStory)"
            autoplay
            muted
            loop
            class="w-full h-full object-cover"
          ></video>

          <!-- Text Story -->
          <div
            v-else-if="getMediaType(currentStory) === 'TEXT' || (!getMediaUrl(currentStory) && currentStory.caption)"
            class="w-full h-full flex items-center justify-center p-6 text-center text-white font-extrabold text-xl leading-relaxed"
            :style="{ background: currentStory.bg || 'linear-gradient(135deg, #4f46e5, #9333ea, #ec4899)' }"
          >
            {{ currentStory.caption }}
          </div>

          <!-- Image Story -->
          <img
            v-else
            :src="getMediaUrl(currentStory) || defaultAvatar"
            class="w-full h-full object-cover"
          />

          <!-- Caption overlay for Image / Video -->
          <div v-if="getMediaType(currentStory) !== 'TEXT' && currentStory.caption" class="absolute bottom-16 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-2xl text-white text-center text-sm font-medium shadow-lg z-10">
            {{ currentStory.caption }}
          </div>
        </template>

        <!-- Prev / Next Click Targets -->
        <button @click="prevStory" class="absolute left-0 top-0 bottom-0 w-1/3 opacity-0 cursor-pointer z-10" title="Tin trước"></button>
        <button @click="nextStory" class="absolute right-0 top-0 bottom-0 w-1/3 opacity-0 cursor-pointer z-10" title="Tin tiếp theo"></button>
      </div>

      <!-- Footer Reply Box -->
      <div class="p-3 bg-gray-950 border-t border-gray-800 flex items-center gap-2 z-20">
        <input
          type="text"
          v-model="replyText"
          @keyup.enter="handleSendReply"
          placeholder="Gửi tin nhắn..."
          class="flex-1 bg-gray-900 border border-gray-800 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button @click="handleSendReply" class="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
