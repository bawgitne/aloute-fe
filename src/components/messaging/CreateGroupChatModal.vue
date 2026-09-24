<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '../../composables/useThreadsStore'

const store = useThreadsStore()

const groupName = ref('')
const selectedMembers = ref([])

const toggleMember = (user) => {
  const index = selectedMembers.value.findIndex(m => m.id === user.id)
  if (index >= 0) {
    selectedMembers.value.splice(index, 1)
  } else {
    selectedMembers.value.push(user)
  }
}

const handleCreate = () => {
  if (!groupName.value.trim() || selectedMembers.value.length === 0) return
  store.createGroupChat(groupName.value, selectedMembers.value)
}

const handleClose = () => {
  store.isCreateGroupChatModalOpen = false
}
</script>

<template>
  <div v-if="store.isCreateGroupChatModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
    <div class="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col">
      <div class="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <h3 class="text-lg font-bold">Tạo Nhóm Chat Mới</h3>
        <button @click="handleClose" class="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tên Nhóm</label>
          <input
            type="text"
            v-model="groupName"
            placeholder="Ví dụ: Team Design Rocket"
            class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Chọn thành viên</label>
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div
              v-for="user in store.users"
              :key="user.id"
              @click="toggleMember(user)"
              class="flex items-center justify-between p-2.5 rounded-xl border border-gray-800/80 bg-gray-950/60 hover:bg-gray-800/60 cursor-pointer transition"
            >
              <div class="flex items-center gap-3">
                <img :src="user.avatar" class="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p class="text-xs font-bold text-white">{{ user.display_name }}</p>
                  <p class="text-[10px] text-gray-400">@{{ user.username }}</p>
                </div>
              </div>
              <div
                class="w-5 h-5 rounded-md border flex items-center justify-center transition"
                :class="selectedMembers.some(m => m.id === user.id) ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-700 bg-gray-900'"
              >
                <svg v-if="selectedMembers.some(m => m.id === user.id)" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50">
        <button @click="handleClose" class="px-4 py-2 text-sm text-gray-400 hover:text-white">Hủy</button>
        <button
          @click="handleCreate"
          :disabled="!groupName.trim() || selectedMembers.length === 0"
          class="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tạo Nhóm
        </button>
      </div>
    </div>
  </div>
</template>
