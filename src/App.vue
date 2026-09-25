<template>
  <div class="app-wrapper">
    <!-- Top Bar Navigation Header -->
    <Header />

    <!-- Main Content Body -->
    <main class="main-container" :class="{ 'docked-sidebar-mode': store.commentDisplayMode === 'left_comments' }">
      <!-- Left Sidebar Navigation -->
      <SidebarLeft />

      <!-- Center Dynamic View Content -->
      <section class="content-page">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
        </router-view>
      </section>
    </main>

    <!-- Global Floating Modals & Drawers -->
    <AuthModal />
    <CreatePostModal />
    <PostDetailModal />
    <EditPostModal />
    <ReportModal />
    <AnalyticsModal />
    <CreateCommunityModal />
    <CreateGroupChatModal />
    <CreateStoryModal />
    <StoryViewerModal />

    <!-- Global Floating Messaging Components -->
    <ChatDrawer />
    <MultiMiniChatDock />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThreadsStore } from '@/composables/useThreadsStore'
import Header from '@/components/layout/Header.vue'
import SidebarLeft from '@/components/layout/SidebarLeft.vue'
import ChatDrawer from '@/components/messaging/ChatDrawer.vue'
import MultiMiniChatDock from '@/components/messaging/MultiMiniChatDock.vue'

import AuthModal from '@/components/auth/AuthModal.vue'
import CreatePostModal from '@/components/post/CreatePostModal.vue'
import PostDetailModal from '@/components/post/PostDetailModal.vue'
import EditPostModal from '@/components/post/EditPostModal.vue'
import ReportModal from '@/components/post/ReportModal.vue'
import AnalyticsModal from '@/components/post/AnalyticsModal.vue'
import CreateCommunityModal from '@/components/community/CreateCommunityModal.vue'
import CreateGroupChatModal from '@/components/messaging/CreateGroupChatModal.vue'
import CreateStoryModal from '@/components/story/CreateStoryModal.vue'
import StoryViewerModal from '@/components/story/StoryViewerModal.vue'

const store = useThreadsStore()
const route = useRoute()

// Sync route changes with store.activeTab
watch(
  () => route.path,
  (newPath) => {
    if (!newPath) return
    if (newPath.startsWith('/profile') || newPath.startsWith('/@')) {
      store.activeTab = 'profile'
    } else if (newPath.startsWith('/friends')) {
      store.activeTab = 'friends'
    } else if (newPath.startsWith('/communities') || newPath.startsWith('/c/')) {
      store.activeTab = 'communities'
    } else if (newPath.startsWith('/custom-feeds')) {
      store.activeTab = 'custom_feeds'
    } else if (newPath.startsWith('/messages')) {
      store.activeTab = 'messages'
    } else if (newPath.startsWith('/notifications')) {
      store.activeTab = 'notifications'
    } else if (newPath.startsWith('/moderation')) {
      store.activeTab = 'moderation'
    } else if (newPath.startsWith('/analytics')) {
      store.activeTab = 'analytics'
    } else if (newPath.startsWith('/saved') || newPath.startsWith('/bookmarks')) {
      store.activeTab = 'saved'
    } else {
      store.activeTab = 'feed'
    }
  },
  { immediate: true }
)

onMounted(() => {
  store.commentDisplayMode = 'popup'
  store.selectedPostForComments = null
  store.isPostDetailModalOpen = false
  store.isChatDrawerOpen = false
  store.isCreatePostModalOpen = false
  store.isAuthModalOpen = false
  store.isReportModalOpen = false
  store.isAnalyticsModalOpen = false
  store.isCreateCommunityModalOpen = false
  store.isCreateGroupChatModalOpen = false
  store.isCreateStoryModalOpen = false
  store.isStoryViewerOpen = false
  store.isEditPostModalOpen = false
  store.activeMiniChats = []
})
</script>
