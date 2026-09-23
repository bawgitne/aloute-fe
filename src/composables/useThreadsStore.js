import { reactive, ref, computed, watch } from 'vue'

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
    name: 'Vue Developers Hub',
    slug: 'vue-devs',
    description: 'The premier community for Vue 3, Vite, Pinia, and Nuxt developers to collaborate and share snippets.',
    avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    is_private: false,
    member_count: 14200,
    post_count: 3890,
    is_joined: true,
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
    name: 'AI & Machine Learning Guild',
    slug: 'ai-ml-guild',
    description: 'Exploring LLMs, Agentic Coding, Diffusion models, and future AI tech.',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80',
    is_private: false,
    member_count: 28400,
    post_count: 9120,
    is_joined: true,
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

// Settings
const showMiniProfileCard = ref(true)

// Active State Navigation & UI Filters
const activeTab = ref('feed')
const activeFeedFilter = ref('home')
const selectedCommunity = ref(communities[0])
const selectedConversation = ref(conversations[0])
const selectedProfileUser = ref(currentUser)
const selectedPostForComments = ref(posts[0]) // Selected post to show comments side-panel on right
const selectedPostOffsetTop = ref(0) // Vertical offset of selected post card relative to feed container
const isChatDrawerOpen = ref(false)
const isCreatePostModalOpen = ref(false)
const isReportModalOpen = ref(false)
const reportTargetItem = ref(null)
const isAnalyticsModalOpen = ref(false)
const analyticsTargetPost = ref(null)
const darkTheme = ref(false)

// Methods
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
    quoted_post_id: newPostData.quotedPostId || null,
    quoted_post: newPostData.quotedPost || null,
    visibility: newPostData.visibility || 'PUBLIC',
    allow_reply: newPostData.allowReply || 'EVERYONE',
    allow_quote: newPostData.allowQuote || 'EVERYONE',
    community_id: newPostData.communityId || null,
    flair: newPostData.flair || null,
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
  posts.unshift(newPost)
  currentUser.posts_count++
  selectedPostForComments.value = newPost
  selectedPostOffsetTop.value = 0
}

function addReply(postId, replyContent) {
  const targetPost = posts.find(p => p.id === postId)
  if (targetPost) {
    const newReply = {
      id: `reply_${Date.now()}`,
      user_id: currentUser.id,
      user: {
        id: currentUser.id,
        name: currentUser.display_name,
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
  }
}

function toggleLikePost(post) {
  post.is_liked = !post.is_liked
  if (post.is_liked) {
    post.like_count++
  } else {
    post.like_count--
  }
}

function toggleRepost(post) {
  post.is_reposted = !post.is_reposted
  if (post.is_reposted) {
    post.repost_count++
  } else {
    post.repost_count--
  }
}

function toggleBookmark(post) {
  post.is_bookmarked = !post.is_bookmarked
}

function votePoll(post, optionId) {
  if (!post.poll) return
  const option = post.poll.options.find(o => o.id === optionId)
  if (!option) return

  if (post.poll.user_voted_option_id === optionId) return

  if (!post.poll.allow_multiple && post.poll.user_voted_option_id) {
    const prevOption = post.poll.options.find(o => o.id === post.poll.user_voted_option_id)
    if (prevOption) prevOption.vote_count--
    post.poll.total_votes--
  }

  option.vote_count++
  post.poll.total_votes++
  post.poll.user_voted_option_id = optionId
}

function followUser(targetUser) {
  targetUser.is_following = true
  targetUser.followers_count++
  currentUser.following_count++
}

function unfollowUser(targetUser) {
  targetUser.is_following = false
  targetUser.followers_count--
  currentUser.following_count--
}

function blockUser(targetUser) {
  targetUser.is_blocked = true
  moderation.blockedUsers.push(targetUser)
}

function muteUser(targetUser) {
  targetUser.is_muted = true
  moderation.mutedUsers.push(targetUser)
}

function hidePost(post) {
  moderation.hiddenPosts.push(post.id)
}

function submitReport(reason, description) {
  if (!reportTargetItem.value) return
  moderation.reports.unshift({
    id: `rep_${Date.now()}`,
    reporter: currentUser.display_name,
    target: reportTargetItem.value.name || reportTargetItem.value.content || 'Item',
    reason,
    description,
    status: 'PENDING',
    created_at: 'Just now'
  })
  isReportModalOpen.value = false
  reportTargetItem.value = null
}

function joinCommunity(comm) {
  comm.is_joined = true
  comm.member_count++
}

function leaveCommunity(comm) {
  comm.is_joined = false
  comm.member_count--
}

function sendMessage(convId, content) {
  const conv = conversations.find(c => c.id === convId)
  if (!conv) return
  const newMsg = {
    id: `msg_${Date.now()}`,
    sender_id: currentUser.id,
    content,
    created_at: 'Just now',
    reactions: []
  }
  conv.messages.push(newMsg)
  conv.last_message = `You: ${content}`
  conv.last_time = 'Just now'
}

function addMessageReaction(msg, emoji) {
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

export function useThreadsStore() {
  return {
    currentUser,
    users,
    topics,
    communities,
    customFeeds,
    posts,
    conversations,
    notifications,
    moderation,
    showMiniProfileCard,
    activeTab,
    activeFeedFilter,
    selectedCommunity,
    selectedConversation,
    selectedProfileUser,
    selectedPostForComments,
    selectedPostOffsetTop,
    isChatDrawerOpen,
    isCreatePostModalOpen,
    isReportModalOpen,
    reportTargetItem,
    isAnalyticsModalOpen,
    analyticsTargetPost,
    darkTheme,
    toggleDarkTheme,
    createPost,
    addReply,
    toggleLikePost,
    toggleRepost,
    toggleBookmark,
    votePoll,
    followUser,
    unfollowUser,
    blockUser,
    muteUser,
    hidePost,
    submitReport,
    joinCommunity,
    leaveCommunity,
    sendMessage,
    addMessageReaction,
    createCustomFeed
  }
}
