<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useThreadsStore } from '../../composables/useThreadsStore'

const store = useThreadsStore()

const currentIndex = ref(0)
const progress = ref(0)
let timer = null

const activeStories = computed(() => store.activeStoryGroup?.items || [])
const currentStory = computed(() => activeStories.value[currentIndex.value] || null)

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
    handleClose()
  }
}

const prevStory = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    startProgress()
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
  if (!replyText.value.trim()) return
  if (store.activeStoryGroup) {
    store.sendMessage(store.activeStoryGroup.user.id, `Trả lời Story: ${replyText.value}`)
  }
  replyText.value = ''
}
</script>

<template>
  <div v-if="store.isStoryViewerOpen && store.activeStoryGroup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fade-in">
    <!-- Close button -->
    <button @click="handleClose" class="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-800/80 text-white hover:bg-gray-700 transition">
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
      <div class="absolute top-6 left-4 right-4 z-20 flex items-center gap-3">
        <img :src="store.activeStoryGroup.user.avatar" class="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover" />
        <div class="text-white drop-shadow">
          <p class="font-bold text-sm leading-tight">{{ store.activeStoryGroup.user.display_name }}</p>
          <p class="text-xs text-gray-300">@{{ store.activeStoryGroup.user.username }}</p>
        </div>
      </div>

      <!-- Story Content -->
      <div class="flex-1 relative flex items-center justify-center bg-black">
        <template v-if="currentStory">
          <video
            v-if="currentStory.media_type === 'VIDEO'"
            :src="currentStory.media_url"
            autoplay
            muted
            loop
            class="w-full h-full object-cover"
          ></video>
          <img
            v-else
            :src="currentStory.media_url"
            class="w-full h-full object-cover"
          />

          <div v-if="currentStory.caption" class="absolute bottom-16 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-2xl text-white text-center text-sm font-medium shadow-lg">
            {{ currentStory.caption }}
          </div>
        </template>

        <!-- Prev / Next Click Targets -->
        <button @click="prevStory" class="absolute left-0 top-0 bottom-0 w-1/3 opacity-0 cursor-pointer"></button>
        <button @click="nextStory" class="absolute right-0 top-0 bottom-0 w-1/3 opacity-0 cursor-pointer"></button>
      </div>

      <!-- Footer Reply Box -->
      <div class="p-3 bg-gray-950 border-t border-gray-800 flex items-center gap-2">
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
