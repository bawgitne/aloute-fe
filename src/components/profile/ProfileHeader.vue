<template>
  <div v-if="user" class="profile-header-component">
    <div class="card-social profile-banner-card">
      <div class="cover-wrapper">
        <img :src="user.cover || defaultCover" class="cover-img" />
      </div>

      <div class="profile-details-body">
        <div class="avatar-action-row">
          <img :src="user.avatar || defaultAvatar" class="avatar avatar-xl profile-avatar" />

          <div class="profile-actions">
            <!-- If Current User -->
            <button
              v-if="user.id === currentUser.id"
              class="btn-outline"
              @click="showEditModal = true"
            >
              <i class="fa-solid fa-pen"></i> Edit Profile
            </button>

            <!-- If Other User -->
            <template v-else>
              <button
                class="btn-primary"
                :class="{ 'btn-outline': user.is_following }"
                @click="user.is_following ? unfollowUser(user) : followUser(user)"
              >
                {{ user.is_following ? 'Following' : 'Follow' }}
              </button>

              <button class="btn-icon" @click="toggleSafetyMenu" title="Safety Settings">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>

              <div v-if="showSafetyMenu" class="safety-menu-dropdown card-social">
                <button class="safety-item" @click="muteUser(user)">
                  <i class="fa-solid fa-volume-xmark"></i> Mute @{{ user.username }}
                </button>
                <button class="safety-item text-danger" @click="blockUser(user)">
                  <i class="fa-solid fa-user-slash"></i> Block @{{ user.username }}
                </button>
              </div>
            </template>
          </div>
        </div>

        <div class="profile-identity">
          <h2>
            {{ user.display_name || user.name }}
            <i v-if="user.is_verified" class="fa-solid fa-circle-check verified-icon"></i>
          </h2>
          <span class="user-handle">@{{ user.username }}</span>
          <p class="user-bio">{{ user.bio }}</p>

          <div v-if="user.website || (user.links && user.links.length)" class="user-links-row">
            <a v-if="user.website" :href="user.website" target="_blank" class="user-link">
              <i class="fa-solid fa-link"></i> {{ user.website }}
            </a>
            <template v-if="user.links">
              <a
                v-for="(link, i) in user.links"
                :key="i"
                :href="link.url"
                target="_blank"
                class="user-link"
              >
                <i class="fa-solid fa-globe"></i> {{ link.title }}
              </a>
            </template>
          </div>
        </div>

        <div class="profile-counters-row">
          <div class="counter-item">
            <strong>{{ user.posts_count || 0 }}</strong>
            <span>Threads</span>
          </div>
          <div class="counter-divider"></div>
          <div class="counter-item">
            <strong>{{ user.followers_count || 0 }}</strong>
            <span>Followers</span>
          </div>
          <div class="counter-divider"></div>
          <div class="counter-item">
            <strong>{{ user.following_count || 0 }}</strong>
            <span>Following</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <EditProfileModal v-if="showEditModal" @close="showEditModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import EditProfileModal from './EditProfileModal.vue'

const props = defineProps({
  user: { type: Object, required: true }
})

const {
  currentUser,
  followUser,
  unfollowUser,
  blockUser,
  muteUser
} = useThreadsStore()

const showEditModal = ref(false)
const showSafetyMenu = ref(false)

const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
const defaultCover = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'

function toggleSafetyMenu() {
  showSafetyMenu.value = !showSafetyMenu.value
}
</script>

<style scoped>
.profile-banner-card {
  padding: 0;
  overflow: hidden;
  margin-bottom: 20px;
}

.cover-wrapper {
  height: 180px;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details-body {
  padding: 0 24px 20px 24px;
}

.avatar-action-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: -45px;
  margin-bottom: 16px;
  position: relative;
}

.profile-avatar {
  border: 4px solid var(--bg-surface);
  box-shadow: var(--shadow-md);
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.safety-menu-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  width: 180px;
  padding: 6px;
  z-index: 50;
}

.safety-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
}

.safety-item:hover {
  background: var(--bg-surface-secondary);
}

.profile-identity h2 {
  font-size: 22px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
}

.verified-icon {
  color: var(--primary-color);
  font-size: 16px;
}

.user-handle {
  color: var(--text-muted);
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}

.user-bio {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-main);
  margin-bottom: 12px;
}

.user-links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 16px;
}

.user-link {
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.profile-counters-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.counter-item {
  display: flex;
  gap: 6px;
  align-items: center;
}

.counter-item strong {
  font-size: 16px;
  color: var(--text-main);
}

.counter-item span {
  font-size: 13px;
  color: var(--text-muted);
}

.counter-divider {
  width: 1px;
  height: 20px;
  background: var(--border-color);
}

.text-danger { color: var(--danger-color); }
</style>
