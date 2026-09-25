import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CommunitiesView from '@/views/CommunitiesView.vue'
import CommunityDetail from '@/components/community/CommunityDetail.vue'
import CustomFeedsView from '@/views/CustomFeedsView.vue'
import FriendsView from '@/views/FriendsView.vue'
import MessagingView from '@/views/MessagingView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import ModerationView from '@/views/ModerationView.vue'
import AnalyticsView from '@/views/AnalyticsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/feed',
    name: 'feed',
    component: HomeView
  },
  {
    path: '/profile',
    name: 'my-profile',
    component: ProfileView
  },
  {
    path: '/profile/:username',
    name: 'user-profile',
    component: ProfileView,
    props: true
  },
  {
    path: '/@:username',
    name: 'at-user-profile',
    component: ProfileView,
    props: true
  },
  {
    path: '/friends',
    name: 'friends',
    component: FriendsView
  },
  {
    path: '/communities',
    name: 'communities',
    component: CommunitiesView
  },
  {
    path: '/c/:slug',
    name: 'community-detail',
    component: CommunityDetail,
    props: true
  },
  {
    path: '/custom-feeds',
    name: 'custom-feeds',
    component: CustomFeedsView
  },
  {
    path: '/messages',
    name: 'messages',
    component: MessagingView
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsView
  },
  {
    path: '/moderation',
    name: 'moderation',
    component: ModerationView
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: AnalyticsView
  },
  {
    path: '/topic/:name',
    name: 'topic-detail',
    component: () => import('@/views/TopicDetailView.vue'),
    props: true
  },
  {
    path: '/t/:name',
    name: 'topic-detail-short',
    component: () => import('@/views/TopicDetailView.vue'),
    props: true
  },
  {
    path: '/saved',
    name: 'saved-posts',
    component: () => import('@/views/SavedPostsView.vue')
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: () => import('@/views/SavedPostsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
