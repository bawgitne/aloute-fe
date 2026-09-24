<template>
  <div class="app-wrapper">
    <!-- Top Bar Navigation Header -->
    <Header />

    <!-- Main Content Body -->
    <main class="main-container" :class="{ 'docked-sidebar-mode': commentDisplayMode === 'left_comments' }">
      <!-- Left Sidebar Navigation -->
      <SidebarLeft />

      <!-- Center Dynamic View Content -->
      <section class="content-page">
        <KeepAlive>
          <component :is="currentViewComponent" />
        </KeepAlive>
      </section>
    </main>

    <!-- Global Floating Modals & Drawers -->
    <CreatePostModal />
    <EditPostModal />
    <AuthModal />
    <CreateStoryModal />
    <StoryViewerModal />
    <CreateCommunityModal />
    <CreateGroupChatModal />
    <ReportModal />
    <AnalyticsModal />
    <PostDetailModal />
    <ChatDrawer />
    <MultiMiniChatDock />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThreadsStore } from '@/composables/useThreadsStore'
import Header from '@/components/layout/Header.vue'
import SidebarLeft from '@/components/layout/SidebarLeft.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CommunitiesView from '@/views/CommunitiesView.vue'
import CommunityDetail from '@/components/community/CommunityDetail.vue'
import CustomFeedsView from '@/views/CustomFeedsView.vue'
import MessagingView from '@/views/MessagingView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import ModerationView from '@/views/ModerationView.vue'
import AnalyticsView from '@/views/AnalyticsView.vue'
import FriendsView from '@/views/FriendsView.vue'
import CreatePostModal from '@/components/post/CreatePostModal.vue'
import EditPostModal from '@/components/post/EditPostModal.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import CreateStoryModal from '@/components/story/CreateStoryModal.vue'
import StoryViewerModal from '@/components/story/StoryViewerModal.vue'
import CreateCommunityModal from '@/components/community/CreateCommunityModal.vue'
import CreateGroupChatModal from '@/components/messaging/CreateGroupChatModal.vue'
import ReportModal from '@/components/post/ReportModal.vue'
import AnalyticsModal from '@/components/post/AnalyticsModal.vue'
import PostDetailModal from '@/components/post/PostDetailModal.vue'
import ChatDrawer from '@/components/messaging/ChatDrawer.vue'
import MultiMiniChatDock from '@/components/messaging/MultiMiniChatDock.vue'

const { activeTab, commentDisplayMode } = useThreadsStore()

const currentViewComponent = computed(() => {
  switch (activeTab.value) {
    case 'feed': return HomeView
    case 'profile': return ProfileView
    case 'communities': return CommunitiesView
    case 'community_detail': return CommunityDetail
    case 'custom_feeds': return CustomFeedsView
    case 'friends': return FriendsView
    case 'messages': return MessagingView
    case 'notifications': return NotificationsView
    case 'moderation': return ModerationView
    case 'analytics': return AnalyticsView
    default: return HomeView
  }
})
</script>
