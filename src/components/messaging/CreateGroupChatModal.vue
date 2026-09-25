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
  <div v-if="store.isCreateGroupChatModalOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content max-w-md">
      <div class="modal-header">
        <h3><i class="fa-solid fa-users-plus text-primary"></i> Tạo Nhóm Chat Mới</h3>
        <button class="btn-icon btn-sm" @click="handleClose"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="modal-body space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tên Nhóm</label>
          <input
            type="text"
            v-model="groupName"
            placeholder="Ví dụ: Team Design Rocket"
            class="form-input"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Chọn thành viên ({{ selectedMembers.length }} đã chọn)</label>
          <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
            <div
              v-for="user in store.users"
              :key="user.id"
              @click="toggleMember(user)"
              class="flex items-center justify-between p-2.5 rounded-xl border border-gray-800 bg-gray-950/60 hover:bg-gray-800/60 cursor-pointer transition"
            >
              <div class="flex items-center gap-3">
                <img :src="user.avatar" class="avatar avatar-sm" />
                <div>
                  <p class="text-xs font-bold text-white">{{ user.display_name }}</p>
                  <p class="text-[10px] text-gray-400">@{{ user.username }}</p>
                </div>
              </div>
              <div
                class="w-5 h-5 rounded-md border flex items-center justify-center transition"
                :class="selectedMembers.some(m => m.id === user.id) ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-700 bg-gray-900'"
              >
                <i v-if="selectedMembers.some(m => m.id === user.id)" class="fa-solid fa-check text-[10px]"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="handleClose" class="btn-outline">Hủy</button>
        <button
          @click="handleCreate"
          :disabled="!groupName.trim() || selectedMembers.length === 0"
          class="btn-primary"
        >
          Tạo Nhóm
        </button>
      </div>
    </div>
  </div>
</template>
