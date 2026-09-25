import { reactive, ref, computed, watch, isRef } from 'vue'

// Current Active User
const currentUser = reactive({
  id: 'usr_1',
  username: 'alex_dev',
  email: 'alex@threads.app',
  is_verified: true,
  is_private: false,
  display_name: 'Alex Rivera',
  bio: 'Fullstack Architect & UI Enthusiast 🚀 Building the modern web with Vue & Vite.',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  website: 'https://alexrivera.dev',
  followers_count: 1420,
  following_count: 380,
  posts_count: 42,
  links: [
    { title: 'Portfolio', url: 'https://alexrivera.dev' },
    { title: 'GitHub', url: 'https://github.com/alexrivera' }
  ]
})

// Other Mock Users
const users = reactive([
  {
    id: 'usr_2',
    username: 'sarah_ux',
    display_name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Product Designer @SocialV | Design Systems & Micro-interactions',
    is_verified: true,
    is_private: false,
    followers_count: 3200,
    following_count: 210,
    posts_count: 184,
    is_following: true,
    is_follower: true,
    is_blocked: false,
    is_muted: false,
    is_restricted: false
  },
  {
    id: 'usr_3',
    username: 'marcus_ai',
    display_name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    bio: 'AI Researcher & LLM Specialist 🤖 Writing about agents & neural nets.',
    is_verified: true,
    is_private: false,
    followers_count: 8900,
    following_count: 150,
    posts_count: 312,
    is_following: false,
    is_follower: false,
    is_blocked: false,
    is_muted: false,
    is_restricted: false
  },
  {
    id: 'usr_4',
    username: 'elena_rodriguez',
    display_name: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Frontend Specialist & Vue.js Core Advocate',
    is_verified: false,
    is_private: false,
    followers_count: 650,
    following_count: 420,
    posts_count: 95,
    is_following: true,
    is_follower: true,
    is_blocked: false,
    is_muted: false,
    is_restricted: false
  }
])

// System Topics
const topics = reactive([
  { id: 'top_1', name: 'VueJS', post_count: 1420 },
  { id: 'top_2', name: 'WebDev', post_count: 3890 },
  { id: 'top_3', name: 'ArtificialIntelligence', post_count: 8900 },
  { id: 'top_4', name: 'UIUXDesign', post_count: 2310 },
  { id: 'top_5', name: 'Cloudflare', post_count: 1120 }
])

// Communities
const communities = reactive([
  {
    id: 'comm_1',
    creator_id: 'usr_1',
    name: 'Vue Developers Hub',
    slug: 'vue-devs',
    description: 'The premier community for Vue 3, Vite, Pinia, and Nuxt developers to collaborate and share snippets.',
    avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    is_private: false,
    member_count: 14200,
    post_count: 3890,
    is_joined: true,
    is_requested: false,
    members: [
      { id: 'usr_1', name: 'Alex Rivera', username: 'alex_dev', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', role: 'ADMIN' },
      { id: 'usr_2', name: 'Sarah Chen', username: 'sarah_ux', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'MODERATOR' }
    ],
    join_requests: [],
    flairs: [
      { id: 'flair_1', title: 'Showcase', color: '#00d084' },
      { id: 'flair_2', title: 'Help Needed', color: '#ffb800' },
      { id: 'flair_3', title: 'Discussion', color: '#50b5ff' }
    ],
    champions: [
      { id: 'usr_1', name: 'Alex Rivera', role: 'Vue Master' },
      { id: 'usr_4', name: 'Elena Rodriguez', role: 'Top Contributor' }
    ]
  },
  {
    id: 'comm_2',
    creator_id: 'usr_3',
    name: 'AI & Machine Learning Guild',
    slug: 'ai-ml-guild',
    description: 'Exploring LLMs, Agentic Coding, Diffusion models, and future AI tech.',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80',
    is_private: true,
    member_count: 28400,
    post_count: 9120,
    is_joined: false,
    is_requested: false,
    members: [
      { id: 'usr_3', name: 'Marcus Vance', username: 'marcus_ai', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', role: 'ADMIN' }
    ],
    join_requests: [
      { id: 'usr_4', name: 'Elena Rodriguez', username: 'elena_rodriguez', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' }
    ],
    flairs: [
      { id: 'flair_4', title: 'Paper Review', color: '#6f42c1' },
      { id: 'flair_5', title: 'Prompt Eng', color: '#ff5252' }
    ],
    champions: [
      { id: 'usr_3', name: 'Marcus Vance', role: 'AI Champion' }
    ]
  }
])

// Custom Feeds
const customFeeds = reactive([
  {
    id: 'feed_1',
    name: 'Tech & Architecture Feed',
    description: 'Curated posts from top frontend engineers and AI researchers.',
    is_private: false,
    topics: ['VueJS', 'WebDev', 'Cloudflare'],
    users: ['sarah_ux', 'marcus_ai'],
    is_saved: true
  },
  {
    id: 'feed_2',
    name: 'Design & UX Daily',
    description: 'Micro-animations, Figma tips, and UI breakdowns.',
    is_private: false,
    topics: ['UIUXDesign'],
    users: ['sarah_ux'],
    is_saved: true
  }
])

// Posts Stream
const posts = reactive([
  {
    id: 'pst_1',
    user_id: 'usr_2',
    user: {
      id: 'usr_2',
      name: 'Sarah Chen',
      username: 'sarah_ux',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      is_verified: true
    },
    content: 'Just finalized the design tokens for our new SocialV design system update! ✨ Micro-animations and glassmorphism elements are looking so smooth in Vue 3.',
    parent_post_id: null,
    quoted_post_id: null,
    quoted_post: null,
    visibility: 'PUBLIC',
    allow_reply: 'EVERYONE',
    allow_quote: 'EVERYONE',
    community_id: null,
    flair: null,
    topics: ['UIUXDesign', 'VueJS'],
    media: [
      { id: 'med_1', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80' }
    ],
    poll: null,
    like_count: 48,
    reply_count: 2,
    repost_count: 12,
    quote_count: 4,
    view_count: 1240,
    link_clicks_count: 85,
    is_liked: true,
    is_reposted: false,
    is_bookmarked: true,
    created_at: '2 hours ago',
    replies: [
      {
        id: 'pst_1_reply_1',
        user_id: 'usr_1',
        user: {
          id: 'usr_1',
          name: 'Alex Rivera',
          username: 'alex_dev',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          is_verified: true
        },
        content: 'Love the contrast ratio on those secondary action buttons Sarah! Are you using CSS custom properties for dark mode token switching?',
        parent_post_id: 'pst_1',
        created_at: '1 hour ago',
        like_count: 6,
        is_liked: false
      },
      {
        id: 'pst_1_reply_2',
        user_id: 'usr_4',
        user: {
          id: 'usr_4',
          name: 'Elena Rodriguez',
          username: 'elena_rodriguez',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          is_verified: false
        },
        content: 'The glassmorphism blur intensity on the header navbar is super crisp too!',
        parent_post_id: 'pst_1',
        created_at: '45 mins ago',
        like_count: 4,
        is_liked: true
      }
    ]
  },
  {
    id: 'pst_2',
    user_id: 'usr_3',
    user: {
      id: 'usr_3',
      name: 'Marcus Vance',
      username: 'marcus_ai',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      is_verified: true
    },
    content: 'Which AI architecture pattern will dominate autonomous web applications in 2026? Vote below and share your thoughts in the replies! 🚀',
    parent_post_id: null,
    quoted_post_id: null,
    quoted_post: null,
    visibility: 'PUBLIC',
    allow_reply: 'EVERYONE',
    allow_quote: 'EVERYONE',
    community_id: 'comm_2',
    flair: { id: 'flair_4', title: 'Discussion', color: '#6f42c1' },
    topics: ['ArtificialIntelligence', 'WebDev'],
    media: [],
    poll: {
      id: 'poll_1',
      question: 'Which framework is best for stateful agentic workflows?',
      allow_multiple: false,
      total_votes: 342,
      user_voted_option_id: 'opt_1',
      options: [
        { id: 'opt_1', text: 'Cloudflare Agents SDK & Durable Objects', vote_count: 184 },
        { id: 'opt_2', text: 'LangChain & Autonomous Loops', vote_count: 82 },
        { id: 'opt_3', text: 'Custom Stateful WebSocket Servers', vote_count: 76 }
      ]
    },
    like_count: 124,
    reply_count: 18,
    repost_count: 35,
    quote_count: 9,
    view_count: 3420,
    link_clicks_count: 210,
    is_liked: false,
    is_reposted: true,
    is_bookmarked: false,
    created_at: '4 hours ago',
    replies: [
      {
        id: 'pst_2_reply_1',
        user_id: 'usr_1',
        user: {
          id: 'usr_1',
          name: 'Alex Rivera',
          username: 'alex_dev',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          is_verified: true
        },
        content: 'Durable Objects handle persistent WebSockets effortlessly. Highly recommended for live state!',
        parent_post_id: 'pst_2',
        created_at: '2 hours ago',
        like_count: 12,
        is_liked: true
      }
    ]
  },
  {
    id: 'pst_3',
    user_id: 'usr_1',
    user: {
      id: 'usr_1',
      name: 'Alex Rivera',
      username: 'alex_dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      is_verified: true
    },
    content: 'This AI survey from @marcus_ai is spot on. Cloudflare Workers + Agents SDK gives zero-cold-start stateful coordination.',
    parent_post_id: null,
    quoted_post_id: 'pst_2',
    quoted_post: {
      id: 'pst_2',
      user: { name: 'Marcus Vance', username: 'marcus_ai' },
      content: 'Which AI architecture pattern will dominate autonomous web applications in 2026?'
    },
    visibility: 'PUBLIC',
    allow_reply: 'EVERYONE',
    allow_quote: 'EVERYONE',
    community_id: 'comm_1',
    flair: { id: 'flair_1', title: 'Showcase', color: '#00d084' },
    topics: ['VueJS', 'Cloudflare'],
    media: [],
    poll: null,
    like_count: 32,
    reply_count: 4,
    repost_count: 8,
    quote_count: 1,
    view_count: 980,
    link_clicks_count: 45,
    is_liked: true,
    is_reposted: false,
    is_bookmarked: false,
    created_at: '3 hours ago',
    replies: []
  }
])

// Messaging Conversations & Direct Messages
const conversations = reactive([
  {
    id: 'conv_1',
    type: 'DIRECT',
    participant: {
      id: 'usr_2',
      name: 'Sarah Chen',
      username: 'sarah_ux',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      online: true
    },
    unread_count: 1,
    last_message: 'Can you check the new SocialV color token palette?',
    last_time: '12:45 PM',
    messages: [
      { id: 'msg_1', sender_id: 'usr_2', content: 'Hey Alex! Are you ready for the Vue 3 component migration?', created_at: '12:40 PM', reactions: ['👍'] },
      { id: 'msg_2', sender_id: 'usr_1', content: 'Yes! Just pushed the Vite setup and style system.', created_at: '12:42 PM', reactions: [] },
      { id: 'msg_3', sender_id: 'usr_2', content: 'Can you check the new SocialV color token palette?', created_at: '12:45 PM', reactions: ['❤️'] }
    ]
  },
  {
    id: 'conv_2',
    type: 'GROUP',
    group_name: 'Vue 3 Core Architecture Team',
    group_avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    unread_count: 0,
    last_message: 'Elena: Let\'s review the PR before deploying.',
    last_time: '11:15 AM',
    messages: [
      { id: 'msg_4', sender_id: 'usr_4', content: 'Let\'s review the PR before deploying to production.', created_at: '11:15 AM', reactions: [] }
    ]
  }
])

// Notifications
const notifications = reactive([
  {
    id: 'notif_1',
    actor: { name: 'Sarah Chen', username: 'sarah_ux', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    type: 'LIKE',
    message: 'liked your post "This AI survey from @marcus_ai is spot on..."',
    post_id: 'pst_3',
    created_at: '10 min ago',
    is_read: false
  },
  {
    id: 'notif_2',
    actor: { name: 'Marcus Vance', username: 'marcus_ai', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
    type: 'QUOTE',
    message: 'quoted your post in AI & Machine Learning Guild',
    post_id: 'pst_2',
    created_at: '1 hour ago',
    is_read: false
  },
  {
    id: 'notif_3',
    actor: { name: 'Elena Rodriguez', username: 'elena_rodriguez', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
    type: 'FOLLOW',
    message: 'started following you',
    post_id: null,
    created_at: '3 hours ago',
    is_read: true
  }
])

// Moderation & Safety Records
const moderation = reactive({
  reports: [
    {
      id: 'rep_1',
      reporter: 'Alex Rivera',
      target: 'Suspicious Bot Account',
      reason: 'SPAM',
      description: 'Repeated automated spam comments across Vue community threads.',
      status: 'PENDING',
      created_at: 'Yesterday'
    }
  ],
  blockedUsers: [],
  mutedUsers: [],
  restrictedUsers: [],
  hiddenPosts: []
})

// Stories System
const stories = reactive([
  {
    id: 'story_group_1',
    user: currentUser,
    items: [
      { id: 'st_1', media_type: 'IMAGE', media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', caption: 'Building the new SocialV architecture! 🚀', created_at: '2 hours ago' }
    ]
  },
  {
    id: 'story_group_2',
    user: users[0], // Sarah Chen
    items: [
      { id: 'st_2', media_type: 'TEXT', media_url: null, bg: 'linear-gradient(135deg, #6f42c1, #00d084)', caption: 'Just launched our Vue 3 design system update! ✨', created_at: '4 hours ago' }
    ]
  },
  {
    id: 'story_group_3',
    user: users[1], // Marcus Vance
    items: [
      { id: 'st_3', media_type: 'IMAGE', media_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', caption: 'Testing autonomous agent execution limits 🤖', created_at: '5 hours ago' }
    ]
  }
])

// Settings
const showMiniProfileCard = ref(true)

// Auth State
const isLoggedIn = ref(true)
const isAuthModalOpen = ref(false)

// Active State Navigation & UI Filters
const activeTab = ref('feed')
const activeFeedFilter = ref('home')
const selectedCommunity = ref(communities[0])
const selectedConversation = ref(conversations[0])
const selectedProfileUser = ref(currentUser)
// Start on a clean feed. Comments are opened explicitly when the user clicks a post.
const commentDisplayMode = ref('popup') // 'sidebar' | 'popup' | 'left_comments'
const selectedPostForComments = ref(null) // No post/panel selected on initial load
const selectedPostOffsetTop = ref(0) // Vertical offset of selected post card relative to feed container
const isPostDetailModalOpen = ref(false)
const isChatDrawerOpen = ref(false)
const chatDrawerSubView = ref('chat') // 'list' | 'chat'
const activeMiniChats = ref([]) // [ { id: 'conv_1', conv, isMinimized: false } ]
const isCreatePostModalOpen = ref(false)
const quotedPostForCreate = ref(null)
const targetCommunityForCreate = ref(null)

const isReportModalOpen = ref(false)
const reportTargetItem = ref(null)
const isAnalyticsModalOpen = ref(false)
const analyticsTargetPost = ref(null)
const darkTheme = ref(false)

// Modals State for new features
const isCreateCommunityModalOpen = ref(false)
const isCreateGroupChatModalOpen = ref(false)
const isCreateStoryModalOpen = ref(false)
const isStoryViewerOpen = ref(false)
const activeStoryGroup = ref(null)

const isEditPostModalOpen = ref(false)
const editingPost = ref(null)

const totalUnreadCount = computed(() => {
  return conversations.reduce((acc, conv) => acc + (conv.unread_count || 0), 0)
})

// Auth Guard Helper
function checkAuth() {
  if (!isLoggedIn.value) {
    isAuthModalOpen.value = true
    return false
  }
  return true
}

// Methods
function pushNotification(type, actor, message, postId = null, targetUserId = 'usr_1') {
  const newNotif = {
    id: `notif_${Date.now()}`,
    target_user_id: targetUserId,
    actor: {
      id: actor.id || 'usr_actor',
      name: actor.display_name || actor.name,
      username: actor.username,
      avatar: actor.avatar
    },
    type,
    message,
    post_id: postId,
    created_at: 'Just now',
    is_read: false
  }
  notifications.unshift(newNotif)
}

function openConversation(param) {
  if (!param) return
  let conv = typeof param === 'string' ? conversations.find(c => c.id === param) : param
  if (conv) {
    conv.unread_count = 0
    selectedConversation.value = conv
    isChatDrawerOpen.value = true
    chatDrawerSubView.value = 'chat'
  }
}

function openMiniChat(target) {
  if (!target) return
  
  let conv = target
  // If target is a User object instead of a Conversation object
  if (target.username && !target.messages) {
    let existingConv = conversations.find(c => c.type === 'DIRECT' && c.participant && c.participant.id === target.id)
    if (!existingConv) {
      existingConv = {
        id: `conv_${Date.now()}`,
        type: 'DIRECT',
        participant: {
          id: target.id,
          name: target.display_name,
          username: target.username,
          avatar: target.avatar,
          online: true
        },
        unread_count: 0,
        last_message: 'Started a new conversation',
        last_time: 'Just now',
        messages: []
      }
      conversations.unshift(existingConv)
    }
    conv = existingConv
  }

  conv.unread_count = 0
  selectedConversation.value = conv
  
  const existing = activeMiniChats.value.find(item => item.id === conv.id)
  if (existing) {
    existing.isMinimized = false
  } else {
    if (activeMiniChats.value.length >= 3) {
      const openItems = activeMiniChats.value.filter(m => !m.isMinimized)
      if (openItems.length >= 3) {
        const firstOpen = activeMiniChats.value.find(m => !m.isMinimized)
        if (firstOpen) firstOpen.isMinimized = true
      }
    }
    activeMiniChats.value.push({
      id: conv.id,
      conv,
      isMinimized: false
    })
  }
}

function closeMiniChat(convId) {
  activeMiniChats.value = activeMiniChats.value.filter(item => item.id !== convId)
}

function toggleMinimizeMiniChat(convId) {
  const item = activeMiniChats.value.find(m => m.id === convId)
  if (item) {
    item.isMinimized = !item.isMinimized
  }
}

function openCreatePostWithQuote(post) {
  quotedPostForCreate.value = post
  targetCommunityForCreate.value = null
  isCreatePostModalOpen.value = true
}

function openCreatePostForCommunity(comm) {
  targetCommunityForCreate.value = comm
  quotedPostForCreate.value = null
  isCreatePostModalOpen.value = true
}

function toggleDarkTheme() {
  darkTheme.value = !darkTheme.value
  if (darkTheme.value) {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
}

function createPost(newPostData) {
  const newPost = {
    id: `pst_${Date.now()}`,
    user_id: currentUser.id,
    user: {
      id: currentUser.id,
      name: currentUser.display_name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      is_verified: currentUser.is_verified
    },
    content: newPostData.content,
    parent_post_id: null,
    quoted_post_id: newPostData.quotedPostId || (quotedPostForCreate.value ? quotedPostForCreate.value.id : null),
    quoted_post: newPostData.quotedPost || quotedPostForCreate.value || null,
    visibility: newPostData.visibility || 'PUBLIC',
    allow_reply: newPostData.allowReply || 'EVERYONE',
    allow_quote: newPostData.allowQuote || 'EVERYONE',
    community_id: newPostData.communityId || (targetCommunityForCreate.value ? targetCommunityForCreate.value.id : null),
    flair: newPostData.flair || (targetCommunityForCreate.value && targetCommunityForCreate.value.flairs ? targetCommunityForCreate.value.flairs[0] : null),
    topics: newPostData.topics || [],
    media: newPostData.media || [],
    poll: newPostData.poll || null,
    like_count: 0,
    reply_count: 0,
    repost_count: 0,
    quote_count: 0,
    view_count: 1,
    link_clicks_count: 0,
    is_liked: false,
    is_reposted: false,
    is_bookmarked: false,
    created_at: 'Just now',
    replies: []
  }

  if (newPost.quoted_post_id) {
    const originalPost = posts.find(p => p.id === newPost.quoted_post_id)
    if (originalPost) originalPost.quote_count++
  }
  if (newPost.community_id) {
    const comm = communities.find(c => c.id === newPost.community_id)
    if (comm) comm.post_count++
  }

  posts.unshift(newPost)
  currentUser.posts_count++
  selectedPostForComments.value = newPost
  selectedPostOffsetTop.value = 0
  
  // Reset targets
  quotedPostForCreate.value = null
  targetCommunityForCreate.value = null
}

function openEditPostModal(post) {
  if (!checkAuth()) return
  editingPost.value = post
  isEditPostModalOpen.value = true
}

function editPost(postId, newContent, options = {}) {
  if (!checkAuth()) return
  const target = posts.find(p => p.id === postId)
  if (target) {
    target.content = newContent
    if (options.allow_reply) target.allow_reply = options.allow_reply.toUpperCase()
    if (options.allow_quote) target.allow_quote = options.allow_quote.toUpperCase()
    if (options.media_url) {
      target.media = [{ id: `med_${Date.now()}`, type: options.media_type || 'IMAGE', url: options.media_url }]
    }
    target.created_at = 'Edited just now'
  }
  isEditPostModalOpen.value = false
  editingPost.value = null
}

function deletePost(postId) {
  if (!checkAuth()) return
  const index = posts.findIndex(p => p.id === postId)
  if (index !== -1) {
    posts.splice(index, 1)
    if (currentUser.posts_count > 0) currentUser.posts_count--
  }
}

function addReply(postId, replyContent) {
  if (!checkAuth()) return
  const targetPost = posts.find(p => p.id === postId)
  if (targetPost) {
    const newReply = {
      id: `reply_${Date.now()}`,
      user_id: currentUser.id,
      user: {
        id: currentUser.id,
        name: currentUser.display_name,
        display_name: currentUser.display_name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        is_verified: currentUser.is_verified
      },
      content: replyContent,
      parent_post_id: postId,
      created_at: 'Just now',
      like_count: 0,
      is_liked: false
    }
    targetPost.replies.push(newReply)
    targetPost.reply_count++

    if (targetPost.user_id !== currentUser.id) {
      pushNotification('REPLY', currentUser, `replied: "${replyContent.slice(0, 35)}..."`, postId, targetPost.user_id)
    }
  }
}

function toggleLikePost(post) {
  if (!checkAuth()) return
  post.is_liked = !post.is_liked
  if (post.is_liked) {
    post.like_count++
    if (post.user_id !== currentUser.id) {
      pushNotification('LIKE', currentUser, `liked your thread "${post.content.slice(0, 30)}..."`, post.id, post.user_id)
    }
  } else {
    post.like_count--
  }
}

function toggleRepost(post) {
  if (!checkAuth()) return
  post.is_reposted = !post.is_reposted
  if (post.is_reposted) {
    post.repost_count++
    if (post.user_id !== currentUser.id) {
      pushNotification('QUOTE', currentUser, `reposted your thread "${post.content.slice(0, 30)}..."`, post.id, post.user_id)
    }
  } else {
    post.repost_count--
  }
}

function toggleBookmark(post) {
  if (!checkAuth()) return
  post.is_bookmarked = !post.is_bookmarked
}

function votePoll(post, optionId) {
  if (!checkAuth()) return
  if (!post.poll) return
  const option = post.poll.options.find(o => o.id === optionId)
  if (!option) return

  if (!post.poll.user_voted_option_ids) {
    post.poll.user_voted_option_ids = post.poll.user_voted_option_id ? [post.poll.user_voted_option_id] : []
  }

  if (post.poll.allow_multiple) {
    const idx = post.poll.user_voted_option_ids.indexOf(optionId)
    if (idx >= 0) {
      post.poll.user_voted_option_ids.splice(idx, 1)
      option.vote_count = Math.max(0, option.vote_count - 1)
      post.poll.total_votes = Math.max(0, post.poll.total_votes - 1)
    } else {
      post.poll.user_voted_option_ids.push(optionId)
      option.vote_count++
      post.poll.total_votes++
    }
  } else {
    if (post.poll.user_voted_option_id === optionId) return
    if (post.poll.user_voted_option_id) {
      const prevOption = post.poll.options.find(o => o.id === post.poll.user_voted_option_id)
      if (prevOption) prevOption.vote_count = Math.max(0, prevOption.vote_count - 1)
      post.poll.total_votes = Math.max(0, post.poll.total_votes - 1)
    }
    option.vote_count++
    post.poll.total_votes++
    post.poll.user_voted_option_id = optionId
    post.poll.user_voted_option_ids = [optionId]
  }
}

function followUser(targetUser) {
  if (!checkAuth()) return
  targetUser.is_following = true
  targetUser.followers_count++
  currentUser.following_count++
  pushNotification('FOLLOW', currentUser, 'started following you', null, targetUser.id)
}

function unfollowUser(targetUser) {
  if (!checkAuth()) return
  targetUser.is_following = false
  targetUser.followers_count--
  currentUser.following_count--
}

function blockUser(targetUser) {
  if (!checkAuth()) return
  targetUser.is_blocked = true
  if (!moderation.blockedUsers.some(u => u.id === targetUser.id)) {
    moderation.blockedUsers.push(targetUser)
  }
}

function muteUser(targetUser) {
  if (!checkAuth()) return
  targetUser.is_muted = true
  if (!moderation.mutedUsers.some(u => u.id === targetUser.id)) {
    moderation.mutedUsers.push(targetUser)
  }
}

function restrictUser(targetUser) {
  if (!checkAuth()) return
  targetUser.is_restricted = true
  if (!moderation.restrictedUsers.some(u => u.id === targetUser.id)) {
    moderation.restrictedUsers.push(targetUser)
  }
}

function unrestrictUser(targetUser) {
  if (!checkAuth()) return
  targetUser.is_restricted = false
  moderation.restrictedUsers = moderation.restrictedUsers.filter(u => u.id !== targetUser.id)
}

function hidePost(post) {
  if (!moderation.hiddenPosts.includes(post.id)) {
    moderation.hiddenPosts.push(post.id)
  }
}

function submitReport(reason, description) {
  if (!checkAuth()) return
  if (!reportTargetItem.value) return
  moderation.reports.unshift({
    id: `rep_${Date.now()}`,
    type: reportTargetItem.value.username ? 'USER' : 'POST',
    reporter: currentUser.display_name,
    target: reportTargetItem.value.name || reportTargetItem.value.username || reportTargetItem.value.content || 'Reported Item',
    reason,
    description,
    status: 'PENDING',
    created_at: 'Just now'
  })
  isReportModalOpen.value = false
  reportTargetItem.value = null
}

function reportUser(targetUser, reason = 'OTHER') {
  if (!checkAuth()) return
  reportTargetItem.value = targetUser
  isReportModalOpen.value = true
}

function updateReportStatus(reportId, newStatus) {
  const report = moderation.reports.find(r => r.id === reportId)
  if (report) {
    report.status = newStatus
  }
}

function joinCommunity(comm) {
  if (!checkAuth()) return
  if (comm.is_private) {
    comm.is_requested = true
    if (!comm.join_requests) comm.join_requests = []
    if (!comm.join_requests.some(r => r.id === currentUser.id)) {
      comm.join_requests.push({ id: currentUser.id, name: currentUser.display_name, username: currentUser.username, avatar: currentUser.avatar })
    }
  } else {
    comm.is_joined = true
    comm.member_count++
    if (!comm.members) comm.members = []
    if (!comm.members.some(m => m.id === currentUser.id)) {
      comm.members.push({ id: currentUser.id, name: currentUser.display_name, username: currentUser.username, avatar: currentUser.avatar, role: 'MEMBER' })
    }
  }
}

function leaveCommunity(comm) {
  if (!checkAuth()) return
  comm.is_joined = false
  comm.is_requested = false
  comm.member_count = Math.max(0, comm.member_count - 1)
  if (comm.members) {
    comm.members = comm.members.filter(m => m.id !== currentUser.id)
  }
}

function approveJoinRequest(comm, user) {
  if (!comm.join_requests) return
  comm.join_requests = comm.join_requests.filter(r => r.id !== user.id)
  if (!comm.members) comm.members = []
  comm.members.push({ ...user, role: 'MEMBER' })
  comm.member_count++
}

function rejectJoinRequest(comm, userId) {
  if (!comm.join_requests) return
  comm.join_requests = comm.join_requests.filter(r => r.id !== userId)
}

function createCommunity(commData) {
  if (!checkAuth()) return
  const newComm = {
    id: `comm_${Date.now()}`,
    creator_id: currentUser.id,
    name: commData.name,
    slug: commData.slug || commData.name.toLowerCase().replace(/\s+/g, '-'),
    description: commData.description,
    avatar: commData.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    cover: commData.cover || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    is_private: commData.is_private || false,
    member_count: 1,
    post_count: 0,
    is_joined: true,
    is_requested: false,
    members: [
      { id: currentUser.id, name: currentUser.display_name, username: currentUser.username, avatar: currentUser.avatar, role: 'ADMIN' }
    ],
    join_requests: [],
    flairs: [
      { id: `flair_${Date.now()}_1`, title: 'General', color: '#50b5ff' },
      { id: `flair_${Date.now()}_2`, title: 'Announcement', color: '#e0245e' }
    ]
  }
  communities.unshift(newComm)
  selectedCommunity.value = newComm
  isCreateCommunityModalOpen.value = false
}

function createGroupChat(groupName, memberUsers = []) {
  if (!checkAuth()) return
  const membersList = [
    { id: currentUser.id, name: currentUser.display_name, username: currentUser.username, avatar: currentUser.avatar, role: 'OWNER' },
    ...memberUsers.map(m => ({ id: m.id, name: m.display_name || m.name, username: m.username, avatar: m.avatar, role: 'MEMBER' }))
  ]
  const newGroup = {
    id: `conv_${Date.now()}`,
    type: 'GROUP',
    group_name: groupName,
    group_avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    unread_count: 0,
    last_message: 'Group conversation created',
    last_time: 'Just now',
    messages: [],
    members: membersList
  }
  conversations.unshift(newGroup)
  openMiniChat(newGroup)
  isCreateGroupChatModalOpen.value = false
}

function addGroupMember(convId, user) {
  const conv = conversations.find(c => c.id === convId)
  if (conv && conv.type === 'GROUP') {
    if (!conv.members) conv.members = []
    if (!conv.members.some(m => m.id === user.id)) {
      conv.members.push({ id: user.id, name: user.display_name || user.name, username: user.username, avatar: user.avatar, role: 'MEMBER' })
    }
  }
}

function kickGroupMember(convId, userId) {
  const conv = conversations.find(c => c.id === convId)
  if (conv && conv.type === 'GROUP' && conv.members) {
    conv.members = conv.members.filter(m => m.id !== userId)
  }
}

function sendMessage(convId, content, replyToMsg = null, mediaObj = null) {
  if (!checkAuth()) return
  const conv = conversations.find(c => c.id === convId)
  if (!conv) return

  let replyTo = null
  let mediaUrl = null
  let mediaArr = null

  if (replyToMsg && typeof replyToMsg === 'object' && !replyToMsg.id) {
    replyTo = replyToMsg.reply_to || null
    mediaUrl = replyToMsg.media_url || null
    mediaArr = replyToMsg.media || (mediaUrl ? [{ id: `med_${Date.now()}`, url: mediaUrl }] : null)
  } else {
    replyTo = replyToMsg ? { id: replyToMsg.id, content: replyToMsg.content } : null
    if (typeof mediaObj === 'string') mediaUrl = mediaObj
    else if (mediaObj) { mediaArr = mediaObj; mediaUrl = mediaObj[0]?.url || mediaObj.url }
  }

  const newMsg = {
    id: `msg_${Date.now()}`,
    sender_id: currentUser.id,
    content,
    reply_to: replyTo,
    media_url: mediaUrl,
    media: mediaArr || (mediaUrl ? [{ id: `med_${Date.now()}`, url: mediaUrl }] : null),
    created_at: 'Just now',
    reactions: []
  }
  conv.messages.push(newMsg)
  conv.last_message = `You: ${content || 'Sent an attachment'}`
  conv.last_time = 'Just now'

  if (conv.type === 'DIRECT' && conv.participant && conv.participant.id !== currentUser.id) {
    pushNotification('MESSAGE', currentUser, `sent you a message: "${content.slice(0, 30)}..."`, null, conv.participant.id)
  }
}

function addMessageReaction(msg, emoji) {
  if (!checkAuth()) return
  if (!msg.reactions.includes(emoji)) {
    msg.reactions.push(emoji)
  }
}

function createCustomFeed(name, description, selectedTopics, selectedUsers) {
  const newFeed = {
    id: `feed_${Date.now()}`,
    name,
    description,
    is_private: false,
    topics: selectedTopics,
    users: selectedUsers,
    is_saved: true
  }
  customFeeds.push(newFeed)
}

function markAllNotificationsRead() {
  notifications.forEach(n => { n.is_read = true })
}

function markNotificationRead(notifId) {
  const notif = notifications.find(n => n.id === notifId)
  if (notif) notif.is_read = true
}

// Additional missing handlers

function createStory(storyData) {
  if (!checkAuth('Tạo tin câu chuyện')) return
  const newItem = {
    id: `st_${Date.now()}`,
    media_url: storyData.media_url || currentUser.avatar,
    media_type: storyData.media_type || 'IMAGE',
    caption: storyData.caption || ''
  }

  let existingGroup = stories.find(g => g.user.id === currentUser.id)
  if (existingGroup) {
    existingGroup.items.push(newItem)
    openStoryViewer(existingGroup)
  } else {
    const newGroup = {
      id: `st_g_${Date.now()}`,
      user: { ...currentUser },
      items: [newItem]
    }
    stories.unshift(newGroup)
    openStoryViewer(newGroup)
  }
  isCreateStoryModalOpen.value = false
}

function openStoryViewer(storyGroup) {
  activeStoryGroup.value = storyGroup
  isStoryViewerOpen.value = true
}

function deleteCustomFeed(feedId) {
  const idx = customFeeds.findIndex(f => f.id === feedId)
  if (idx >= 0) customFeeds.splice(idx, 1)
}

function editCustomFeed(feedId, name, description, selectedTopics, selectedUsers) {
  const feed = customFeeds.find(f => f.id === feedId)
  if (feed) {
    feed.name = name
    feed.description = description
    feed.topics = selectedTopics
    feed.users = selectedUsers
  }
}

const storeObject = {
    currentUser,
    users,
    topics,
    communities,
    customFeeds,
    posts,
    conversations,
    notifications,
    moderation,
    stories,
    showMiniProfileCard,
    isLoggedIn,
    isAuthModalOpen,
    activeTab,
    activeFeedFilter,
    selectedCommunity,
    selectedConversation,
    selectedProfileUser,
    selectedPostForComments,
    selectedPostOffsetTop,
    commentDisplayMode,
    isPostDetailModalOpen,
    isChatDrawerOpen,
    chatDrawerSubView,
    isCreatePostModalOpen,
    quotedPostForCreate,
    targetCommunityForCreate,
    isReportModalOpen,
    reportTargetItem,
    isAnalyticsModalOpen,
    analyticsTargetPost,
    isCreateCommunityModalOpen,
    isCreateGroupChatModalOpen,
    isCreateStoryModalOpen,
    isStoryViewerOpen,
    activeStoryGroup,
    isEditPostModalOpen,
    editingPost,
    darkTheme,
    totalUnreadCount,
    checkAuth,
    toggleDarkTheme,
    createPost,
    openCreatePostWithQuote,
    openCreatePostForCommunity,
    openEditPostModal,
    editPost,
    deletePost,
    addReply,
    toggleLikePost,
    toggleRepost,
    toggleBookmark,
    votePoll,
    followUser,
    unfollowUser,
    blockUser,
    muteUser,
    restrictUser,
    unrestrictUser,
    hidePost,
    submitReport,
    reportUser,
    updateReportStatus,
    joinCommunity,
    leaveCommunity,
    approveJoinRequest,
    rejectJoinRequest,
    createCommunity,
    createGroupChat,
    addGroupMember,
    kickGroupMember,
    createStory,
    openStoryViewer,
    deleteCustomFeed,
    editCustomFeed,
    sendMessage,
    addMessageReaction,
    createCustomFeed,
    openConversation,
    openMiniChat,
    activeMiniChats,
    closeMiniChat,
    toggleMinimizeMiniChat,
    markAllNotificationsRead,
    markNotificationRead,
    pushNotification
}

const storeProxy = new Proxy(storeObject, {
  get(target, prop, receiver) {
    const val = Reflect.get(target, prop, receiver)
    if (isRef(val)) {
      return val.value
    }
    return val
  },
  set(target, prop, value, receiver) {
    if (prop in target && isRef(target[prop])) {
      target[prop].value = value
      return true
    }
    return Reflect.set(target, prop, value, receiver)
  }
})

export function useThreadsStore() {
  return storeProxy
}
