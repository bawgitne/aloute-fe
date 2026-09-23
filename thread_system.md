# THREADS CLONE — SYSTEM ARCHITECTURE

> Tài liệu này mô tả toàn bộ kiến trúc logic của hệ thống Threads clone dựa trên ERD hiện tại và các use case đã xác định.
>
> Quy ước:
> - **CURRENT**: đã được thể hiện trực tiếp trong ERD hiện tại.
> - **PROPOSED**: kiến trúc/luồng đề xuất để triển khai hệ thống sạch hơn; chưa nhất thiết đã có trong ERD.
> - **GAP**: nghiệp vụ hợp lý nhưng ERD hiện tại chưa có cấu trúc dữ liệu hỗ trợ đầy đủ.

---

# 1. Mục tiêu hệ thống

Hệ thống mô phỏng một nền tảng mạng xã hội kiểu Threads, tập trung vào:

- Hồ sơ người dùng.
- Quan hệ follow / block / mute / restrict.
- Đăng bài, reply, quote, repost.
- Like, bookmark, mention.
- Media cho post.
- Topic.
- Poll.
- Community.
- Custom Feed.
- Direct Message / Group Message.
- Notification.
- Report / moderation.
- Post analytics cơ bản.

Hệ thống không chỉ lưu bài đăng mà còn mô hình hóa đầy đủ social graph, tương tác, hội thoại, cộng đồng và các cơ chế an toàn người dùng.

---

# 2. Actor của hệ thống

## 2.1 Guest

Người chưa đăng nhập.

### Use case

- Xem public post.
- Xem public profile.
- Xem public community.
- Duyệt topic.
- Đăng ký.
- Đăng nhập.

Guest không được:

- Like.
- Follow.
- Repost.
- Bookmark.
- Message.
- Vote poll.
- Join community.

---

## 2.2 User

Người dùng đã đăng nhập.

Đây là actor chính của hệ thống.

User có thể:

- Quản lý profile.
- Quản lý social connections.
- Tạo và quản lý post.
- Tương tác với post.
- Quản lý topic quan tâm.
- Tạo / tham gia community.
- Tạo custom feed.
- Nhắn tin.
- Nhận notification.
- Report / block / mute / hide / restrict.

---

## 2.3 Community Moderator

Là User có role `MODERATOR` trong một Community.

Có quyền:

- Moderation nội dung trong community.
- Quản lý member ở mức được cho phép.
- Hỗ trợ admin quản trị community.

---

## 2.4 Community Admin / Owner

Là User có role cao trong Community hoặc là `owner_id`.

Có quyền:

- Tạo community.
- Chỉnh sửa thông tin community.
- Quản lý member.
- Gán role.
- Quản lý flair.
- Quản lý champion.
- Quản lý bài viết của community.

---

# 3. Kiến trúc chức năng tổng thể

Hệ thống được chia thành các domain sau:

```text
THREADS CLONE
│
├── Identity & Profile
├── Social Graph
├── Post
│   ├── Media
│   ├── Like
│   ├── Reply
│   ├── Repost
│   ├── Quote
│   ├── Bookmark
│   └── Mention
│
├── Topic
├── Poll
├── Community
├── Custom Feed
├── Messaging
├── Notification
├── Moderation & Safety
└── Analytics
```

---

# 4. Kiến trúc backend logic

## 4.1 Tổng thể

**PROPOSED**

```text
Client
  │
  ▼
REST / API Layer
  │
  ▼
Application / Service Layer
  │
  ├── User Service
  ├── Social Graph Service
  ├── Post Service
  ├── Topic Service
  ├── Poll Service
  ├── Community Service
  ├── Feed Service
  ├── Messaging Service
  ├── Notification Service
  ├── Moderation Service
  └── Analytics Service
  │
  ▼
Repository / Data Access Layer
  │
  ▼
Relational Database
```

Kiến trúc phù hợp nhất ở giai đoạn hiện tại là **modular monolith**.

Không nên tách microservice ngay vì:

- Domain nhiều nhưng chưa cần scale độc lập.
- Transaction giữa user/post/community/message vẫn khá chặt.
- Development và debug đơn giản hơn.
- Có thể tách module thành service riêng sau này.

---

# 5. Các module backend

## 5.1 Identity & Profile Module

### Trách nhiệm

- Account.
- Profile.
- Public/private account.
- Profile links.
- Verification state.
- Account activation state.

### Tables

- `users`
- `profiles`
- `profile_links`

---

## 5.2 Social Graph Module

### Trách nhiệm

- Follow.
- Unfollow.
- Block.
- Mute.

### Tables

- `follows`
- `blocks`
- `mutes`

### Quan hệ

```text
users
 ├── follows
 ├── blocks
 └── mutes
```

Đây đều là self-relationship giữa User và User.

---

# 6. Identity & Profile Data Model

## 6.1 users

Thông tin account chính.

```text
id
username
email
password_hash
is_verified
is_private
is_active
created_at
updated_at
```

### Vai trò

Đây là entity trung tâm nhất toàn hệ thống.

Hầu hết domain đều tham chiếu tới `users.id`.

---

## 6.2 profiles

Quan hệ:

```text
users 1 ─── 1 profiles
```

Dùng `user_id` làm primary key.

Thông tin:

- display name.
- bio.
- avatar.
- website.
- cached counters.

Counters:

- followers_count.
- following_count.
- posts_count.

Các counter này là dữ liệu denormalized.

---

## 6.3 profile_links

Quan hệ:

```text
users 1 ─── N profile_links
```

Cho phép một profile có nhiều external links.

---

# 7. Social Graph

## 7.1 Follow

```text
User A ─── follows ─── User B
```

Table:

```text
follows
(
    follower_id,
    following_id,
    created_at
)
```

Composite PK:

```text
(follower_id, following_id)
```

---

## 7.2 Block

```text
blocks
(
    blocker_id,
    blocked_id
)
```

Dùng để ngăn tương tác giữa hai user.

---

## 7.3 Mute

```text
mutes
(
    user_id,
    muted_user_id
)
```

Khác Block:

- Block ngăn tương tác.
- Mute chủ yếu ẩn nội dung / notification.

---

# 8. Post Architecture

Post là domain trung tâm thứ hai sau User.

## 8.1 posts

```text
posts
(
    id,
    user_id,
    content,
    parent_post_id,
    quoted_post_id,
    visibility,
    allow_reply,
    allow_quote,
    like_count,
    reply_count,
    repost_count,
    quote_count,
    view_count,
    created_at,
    updated_at,
    deleted_at
)
```

---

## 8.2 Normal Post

```text
parent_post_id = NULL
quoted_post_id = NULL
```

---

## 8.3 Reply

Reply không có table riêng.

Reply vẫn là một Post.

```text
parent_post_id != NULL
```

Quan hệ:

```text
posts
  ▲
  │ parent_post_id
posts
```

---

## 8.4 Quote

Quote cũng không có table riêng.

```text
quoted_post_id != NULL
```

Quan hệ:

```text
posts
  ▲
  │ quoted_post_id
posts
```

---

## 8.5 Soft Delete

Post có:

```text
deleted_at
```

Do đó post có thể được soft-delete thay vì xóa vật lý.

---

# 9. Post Media

Table:

```text
post_media
```

Quan hệ:

```text
posts 1 ─── N post_media
```

Hỗ trợ:

- IMAGE.
- VIDEO.
- GIF.

Thông tin thêm:

- width.
- height.
- duration_seconds.
- position.

`position` quyết định thứ tự media.

---

# 10. Post Interaction

## 10.1 Like

```text
post_likes
(
    user_id,
    post_id
)
```

Composite PK:

```text
(user_id, post_id)
```

Một user chỉ like một post tối đa một lần.

---

## 10.2 Repost

```text
reposts
(
    user_id,
    post_id
)
```

Một user chỉ repost một post một lần.

---

## 10.3 Bookmark

```text
bookmarks
(
    user_id,
    post_id
)
```

Bookmark là dữ liệu riêng của user.

---

## 10.4 Mention

```text
post_mentions
(
    post_id,
    mentioned_user_id
)
```

Quan hệ N:N giữa Post và User.

---

# 11. Post Visibility

Enum:

```text
PUBLIC
FOLLOWERS
MENTIONED
```

Ý nghĩa:

### PUBLIC

Ai cũng có thể xem.

### FOLLOWERS

Chỉ followers được xem.

### MENTIONED

Chỉ những người được mention được xem.

---

# 12. Topic Architecture

## 12.1 topics

Lưu topic chung của hệ thống.

Ví dụ:

```text
Technology
Java
Football
Music
AI
```

---

## 12.2 post_topics

```text
posts N ─── N topics
```

Mapping table:

```text
post_topics
(
    post_id,
    topic_id
)
```

---

## 12.3 user_topics

Thể hiện topic user quan tâm.

```text
users N ─── N topics
```

---

# 13. Poll Architecture

Một post có thể chứa tối đa một poll.

## 13.1 polls

Quan hệ:

```text
posts 1 ─── 0..1 polls
```

`post_id` là unique.

---

## 13.2 poll_options

```text
polls 1 ─── N poll_options
```

Mỗi option có:

- text.
- vote count.
- position.

---

## 13.3 poll_votes

Lưu vote của user.

```text
poll_votes
(
    poll_id,
    option_id,
    user_id
)
```

---

# 14. Poll Integrity Issue

**GAP / DESIGN ISSUE**

Hiện unique:

```text
(poll_id, option_id, user_id)
```

Constraint này chỉ ngăn:

```text
User A vote Option 1 hai lần
```

Nhưng vẫn cho phép:

```text
User A
 ├── Option 1
 └── Option 2
```

kể cả khi:

```text
allow_multiple = false
```

Do đó application/service hoặc database constraint bổ sung phải xử lý single-choice poll.

---

# 15. Community Architecture

## 15.1 communities

```text
communities
(
    id,
    owner_id,
    name,
    slug,
    description,
    avatar_url,
    cover_url,
    is_private,
    member_count,
    post_count
)
```

---

## 15.2 Community Membership

Table:

```text
community_members
```

Quan hệ:

```text
users N ─── N communities
```

Thông qua:

```text
community_members
```

Role:

```text
MEMBER
MODERATOR
ADMIN
```

---

# 16. Community Post

Table:

```text
community_posts
```

Quan hệ:

```text
communities N ─── N posts
```

Trong kiến trúc hiện tại, Post vẫn là entity chung.

Community không có loại Post riêng.

---

# 17. Community Flair

## community_flairs

Flair được định nghĩa theo community.

```text
communities 1 ─── N community_flairs
```

---

## user_flairs

Mapping:

```text
User
Community
Flair
```

Một flair assignment thuộc một community cụ thể.

---

# 18. Community Champion

Table:

```text
community_champions
```

Quan hệ:

```text
community N ─── N user
```

Dùng để đánh dấu user nổi bật trong community.

---

# 19. Custom Feed Architecture

Custom Feed là feed do user tự cấu hình.

## 19.1 custom_feeds

Mỗi feed có:

- owner.
- name.
- description.
- public/private state.

```text
users 1 ─── N custom_feeds
```

---

## 19.2 Feed Topics

```text
feed_topics
```

Một custom feed có thể theo dõi nhiều topic.

```text
custom_feeds N ─── N topics
```

---

## 19.3 Feed Users

```text
feed_users
```

Một feed cũng có thể lấy nội dung từ một danh sách user.

```text
custom_feeds N ─── N users
```

---

## 19.4 Saved Feeds

```text
saved_feeds
```

User khác có thể save public feed.

```text
users N ─── N custom_feeds
```

---

# 20. Messaging Architecture

Messaging gồm:

```text
conversations
conversation_members
messages
message_media
message_reactions
```

---

# 21. Conversation

## conversations

Type:

```text
DIRECT
GROUP
```

Có thể có:

- creator.
- group name.
- group avatar.

---

## conversation_members

Quan hệ:

```text
conversations N ─── N users
```

Thông tin membership:

- joined_at.
- last_read_message_id.
- muted state.

---

# 22. Message

```text
messages
(
    id,
    conversation_id,
    sender_id,
    reply_to_message_id,
    content,
    created_at,
    updated_at,
    deleted_at
)
```

---

## 22.1 Message Reply

Message reply dùng self-reference:

```text
reply_to_message_id
```

---

## 22.2 Message Media

```text
messages 1 ─── N message_media
```

Media:

- IMAGE.
- VIDEO.
- GIF.

---

## 22.3 Message Reaction

```text
message_reactions
```

Một user có thể reaction vào message.

Composite PK:

```text
(message_id, user_id, reaction)
```

---

# 23. Notification Architecture

Table:

```text
notifications
```

Notification thuộc về:

```text
user_id
```

Người gây ra hành động:

```text
actor_id
```

Có thể liên kết tới:

- post.
- message.
- community.

---

## Notification Type

```text
LIKE
REPLY
FOLLOW
REPOST
QUOTE
MENTION
MESSAGE
COMMUNITY
```

---

# 24. Moderation & Safety

Module này gồm:

```text
reports
hidden_posts
restricted_users
blocks
mutes
```

---

# 25. Reports

User có thể report:

- User.
- Post.

Fields:

```text
reporter_id
reported_user_id
reported_post_id
reason
description
status
```

Reason:

```text
SPAM
HARASSMENT
HATE
MISINFORMATION
VIOLENCE
OTHER
```

Status:

```text
PENDING
REVIEWED
REJECTED
RESOLVED
```

---

# 26. Hidden Post

```text
hidden_posts
```

Ẩn một post khỏi trải nghiệm của một user.

Không xóa post khỏi hệ thống.

---

# 27. Restricted User

```text
restricted_users
```

Self-relationship giữa User và User.

Khác Block:

- Block mang tính ngăn tương tác mạnh.
- Restrict cho phép giới hạn trải nghiệm mềm hơn.

---

# 28. Analytics

Analytics hiện tại ở mức đơn giản.

Tables:

```text
post_views
link_clicks
```

---

## 28.1 Post View

Mỗi lần post được xem có thể tạo record.

```text
post_id
user_id nullable
viewed_at
```

`user_id` nullable cho phép anonymous view.

---

## 28.2 Link Click

Theo dõi link được click từ Post.

```text
post_id
user_id
url
clicked_at
```

---

# 29. Các quan hệ chính

## User Centric

```text
users
├── profiles
├── profile_links
├── follows
├── blocks
├── mutes
├── posts
├── post_likes
├── reposts
├── bookmarks
├── post_mentions
├── user_topics
├── poll_votes
├── communities
├── community_members
├── user_flairs
├── community_champions
├── custom_feeds
├── saved_feeds
├── conversation_members
├── messages
├── message_reactions
├── notifications
├── reports
├── hidden_posts
├── restricted_users
├── post_views
└── link_clicks
```

---

## Post Centric

```text
posts
├── post_media
├── post_likes
├── reposts
├── bookmarks
├── post_mentions
├── post_topics
├── polls
├── community_posts
├── notifications
├── reports
├── hidden_posts
├── post_views
└── link_clicks
```

---

# 30. Luồng tạo Post

```text
User
 │
 ▼
Create Post
 │
 ├── Add content
 ├── Select visibility
 ├── Configure reply / quote
 │
 ├── [optional] Add media
 ├── [optional] Add mentions
 ├── [optional] Add topic
 └── [optional] Create poll
 │
 ▼
Save posts
 │
 ├── post_media
 ├── post_mentions
 ├── post_topics
 └── polls
```

---

# 31. Luồng Reply

```text
User
 │
 ▼
Select Post
 │
 ▼
Reply
 │
 ▼
Create new posts row
 │
 ▼
parent_post_id = original_post.id
```

---

# 32. Luồng Quote

```text
User
 │
 ▼
Quote Post
 │
 ▼
Create new posts row
 │
 ▼
quoted_post_id = original_post.id
```

---

# 33. Luồng Like

```text
User
 │
 ▼
Like Post
 │
 ▼
INSERT post_likes
 │
 ▼
Update / recalculate posts.like_count
 │
 ▼
Create notification
```

---

# 34. Luồng Follow

```text
Follower
 │
 ▼
Follow User
 │
 ▼
INSERT follows
 │
 ├── Update follower.following_count
 ├── Update target.followers_count
 └── Create FOLLOW notification
```

---

# 35. Luồng Community

```text
User
 │
 ▼
Join Community
 │
 ▼
community_members
 │
 ▼
role = MEMBER
```

Khi tạo post trong community:

```text
Create Post
 │
 ▼
posts
 │
 ▼
community_posts
```

---

# 36. Luồng Poll

```text
Create Post
 │
 ▼
Create Poll
 │
 ├── polls
 │
 └── poll_options
```

Vote:

```text
User
 │
 ▼
Select Poll Option
 │
 ▼
poll_votes
 │
 ▼
Update vote_count
```

---

# 37. Luồng Direct Message

```text
User A
 │
 ▼
Start Conversation
 │
 ├── conversations
 └── conversation_members
      ├── User A
      └── User B
 │
 ▼
Send Message
 │
 ▼
messages
 │
 ├── optional message_media
 └── create MESSAGE notification
```

---

# 38. Luồng Group Message

```text
User
 │
 ▼
Create GROUP conversation
 │
 ▼
Add multiple conversation_members
 │
 ▼
Send messages
```

---

# 39. Luồng Notification

Notification là side-effect của các hành động khác.

Ví dụ:

```text
Like Post
    └── LIKE notification

Reply Post
    └── REPLY notification

Follow User
    └── FOLLOW notification

Mention User
    └── MENTION notification

Send Message
    └── MESSAGE notification
```

User không trực tiếp "create notification".

---

# 40. Luồng Report

```text
User
 │
 ▼
Report Post / User
 │
 ▼
reports
 │
 ▼
status = PENDING
 │
 ▼
Review
 │
 ├── REVIEWED
 ├── REJECTED
 └── RESOLVED
```

---

# 41. API Architecture

**PROPOSED**

API có thể chia theo domain:

```text
/api/auth
/api/users
/api/profiles
/api/social
/api/posts
/api/topics
/api/polls
/api/communities
/api/feeds
/api/conversations
/api/messages
/api/notifications
/api/reports
/api/analytics
```

---

# 42. Service Layer

**PROPOSED**

```text
AuthService
UserService
ProfileService
SocialGraphService
PostService
TopicService
PollService
CommunityService
FeedService
ConversationService
MessageService
NotificationService
ModerationService
AnalyticsService
```

Không nhất thiết mỗi Service tương ứng một table.

Service nên tương ứng với **business domain**.

---

# 43. Repository Layer

**PROPOSED**

Repository chịu trách nhiệm:

- Query database.
- CRUD.
- Persistence.
- Không chứa business rule phức tạp.

Ví dụ:

```text
UserRepository
PostRepository
CommunityRepository
ConversationRepository
MessageRepository
```

Các mapping table nhỏ có thể được truy cập từ repository của aggregate tương ứng thay vì bắt buộc tạo một repository riêng.

---

# 44. Database Architecture

Hiện tại schema phù hợp nhất với relational database.

Lý do:

- Nhiều quan hệ N:N.
- Nhiều foreign key.
- Transaction quan trọng.
- Unique constraint quan trọng.
- Composite primary key xuất hiện nhiều.

Có thể triển khai bằng:

- PostgreSQL.
- MySQL.
- SQL Server.

---

# 45. Media Storage

**PROPOSED**

Không nên lưu image/video binary trực tiếp trong relational DB.

Database chỉ lưu:

```text
media_url
```

Media thực tế nên nằm trong:

```text
Object Storage
```

Ví dụ kiến trúc:

```text
Client
   │ upload
   ▼
Media Service
   │
   ▼
Object Storage
   │
   ▼
URL
   │
   ▼
Database
```

---

# 46. Cache

**PROPOSED — OPTIONAL**

Các dữ liệu phù hợp cache:

- User profile.
- Popular post.
- Topic.
- Feed result.
- Community info.

Redis có thể dùng trong tương lai.

Không bắt buộc ở phiên bản đầu.

---

# 47. Event Architecture

**PROPOSED — OPTIONAL**

Một số hành động có side-effect lớn:

```text
POST_LIKED
POST_REPLIED
USER_FOLLOWED
POST_REPOSTED
USER_MENTIONED
MESSAGE_SENT
COMMUNITY_JOINED
```

Có thể xử lý event:

```text
Post Service
     │
     ▼
Domain Event
     │
     ├── Notification
     ├── Analytics
     └── Counter Update
```

Ở phiên bản đầu có thể xử lý đồng bộ.

Khi scale có thể dùng:

- Kafka.
- RabbitMQ.
- message queue khác.

---

# 48. Counter Strategy

Các table đang lưu nhiều cached counter:

```text
followers_count
following_count
posts_count

like_count
reply_count
repost_count
quote_count
view_count

member_count
post_count

vote_count
```

Đây là denormalization.

Nguồn dữ liệu thực vẫn là các bảng quan hệ.

Ví dụ:

```text
posts.like_count
```

phải đồng bộ với:

```text
COUNT(post_likes)
```

---

# 49. Authentication

**PROPOSED**

ERD hiện chỉ có:

```text
email
password_hash
```

Nó chưa mô tả:

- access token.
- refresh token.
- login session.
- OTP.
- password reset.

Nếu triển khai JWT:

```text
Login
 │
 ▼
Verify credentials
 │
 ▼
Issue Access Token
 │
 ▼
Client sends token
 │
 ▼
Authentication Filter
```

---

# 50. Authorization

Authorization phải kiểm tra ownership và role.

Ví dụ:

## Post

Chỉ owner mới được:

- edit.
- delete.

## Community

`MEMBER`:

- tham gia.
- post.

`MODERATOR`:

- moderation.

`ADMIN`:

- quản lý community.

---

# 51. Soft Delete

Hiện có soft-delete ở:

```text
posts.deleted_at
messages.deleted_at
```

Điều này cho phép:

- Khôi phục.
- Audit.
- Không phá reference.

---

# 52. Known Gaps trong ERD hiện tại

## 52.1 Private Follow Request

Có:

```text
users.is_private
```

nhưng không có:

```text
follow_requests
```

Do đó chưa biểu diễn được:

```text
PENDING
ACCEPTED
REJECTED
```

### Đề xuất

```text
follow_requests
(
    requester_id,
    target_id,
    status,
    created_at,
    responded_at
)
```

---

## 52.2 Private Community Join Request

Có:

```text
communities.is_private
```

nhưng chưa có:

```text
community_join_requests
```

---

## 52.3 Poll Single Choice

Constraint hiện tại chưa enforce được `allow_multiple = false`.

---

## 52.4 Post Interaction Permission

Hiện tại:

```text
allow_reply boolean
allow_quote boolean
```

Khá hạn chế.

Nếu muốn flexible hơn:

```text
reply_permission
quote_permission
```

Ví dụ:

```text
EVERYONE
FOLLOWERS
MENTIONED
NONE
```

---

## 52.5 Message Group Role

Conversation hiện chưa có:

```text
OWNER
ADMIN
MEMBER
```

Do đó chưa support tốt:

- kick member.
- promote admin.
- transfer ownership.

---

## 52.6 Community Moderation

ERD hiện chưa có:

```text
community_bans
community_reports
moderation_logs
```

---

## 52.7 Authentication Infrastructure

Chưa có:

```text
refresh_tokens
sessions
password_reset_tokens
email_verification_tokens
```

---

## 52.8 Notification Preferences

Chưa có:

```text
notification_settings
```

---

# 53. Index Strategy

**PROPOSED**

Một số index quan trọng:

```text
posts(user_id, created_at)

posts(parent_post_id)

posts(quoted_post_id)

post_likes(post_id)

reposts(post_id)

bookmarks(user_id)

follows(follower_id)

follows(following_id)

community_members(user_id)

community_posts(community_id)

messages(conversation_id, created_at)

notifications(user_id, created_at)

post_views(post_id)

link_clicks(post_id)
```

---

# 54. Transaction Boundary

Các operation cần transaction.

Ví dụ Like:

```text
BEGIN

INSERT post_likes

UPDATE posts.like_count

INSERT notifications

COMMIT
```

Follow:

```text
BEGIN

INSERT follows

UPDATE profile counters

INSERT notification

COMMIT
```

Community join:

```text
BEGIN

INSERT community_members

UPDATE communities.member_count

COMMIT
```

---

# 55. Security Rules

Backend không được tin dữ liệu gửi từ client.

Luôn validate:

- user ownership.
- community role.
- block relationship.
- privacy.
- visibility.
- allow_reply.
- allow_quote.
- conversation membership.

Ví dụ trước khi đọc message:

```text
current_user ∈ conversation_members
```

---

# 56. Feed Architecture

ERD lưu dữ liệu cần thiết cho feed nhưng chưa mô hình hóa thuật toán ranking.

Có thể chia:

```text
Home Feed
Following Feed
Custom Feed
Community Feed
Topic Feed
```

---

## Home Feed

**PROPOSED**

Nguồn có thể gồm:

```text
followed users
interested topics
recommended posts
```

---

## Custom Feed

Nguồn:

```text
feed_users
+
feed_topics
```

---

## Community Feed

Nguồn:

```text
community_posts
```

---

# 57. Search

**GAP**

ERD hiện chưa có domain Search riêng.

Có thể search runtime trên:

- username.
- display name.
- post content.
- topic.
- community.

Khi scale có thể dùng full-text search hoặc search engine.

---

# 58. Use Case Overview

```text
Guest
├── Register
├── Login
├── View Public Post
├── View Public Profile
├── Browse Topic
└── Browse Public Community


User
├── Manage Profile
├── Follow User
├── Block User
├── Mute User
├── Restrict User
│
├── Create Post
├── Edit Post
├── Delete Post
├── Add Media
├── Mention User
├── Add Topic
├── Create Poll
│
├── Like Post
├── Reply Post
├── Repost
├── Quote Post
├── Bookmark
├── Hide Post
│
├── Vote Poll
│
├── Join Community
├── Leave Community
├── Create Community Post
├── Use Flair
│
├── Create Custom Feed
├── Edit Custom Feed
├── Save Custom Feed
│
├── Start Conversation
├── Send Message
├── Reply Message
├── React Message
├── Send Message Media
│
├── View Notifications
└── Report User / Post
```

---

# 59. Suggested Package Structure

Nếu triển khai theo modular monolith:

```text
com.example.threads
│
├── auth
│
├── user
│   ├── profile
│   └── social
│
├── post
│   ├── media
│   ├── interaction
│   ├── topic
│   └── poll
│
├── community
│
├── feed
│
├── messaging
│
├── notification
│
├── moderation
│
├── analytics
│
├── common
│   ├── exception
│   ├── security
│   ├── validation
│   └── config
│
└── infrastructure
```

---

# 60. Suggested Layer Structure per Module

```text
post
├── controller
├── service
├── repository
├── entity
├── dto
├── mapper
└── event
```

Luồng:

```text
HTTP Request
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database
```

---

# 61. Aggregate Thinking

Không nên coi mỗi table là một module riêng.

Ví dụ Post aggregate:

```text
Post
├── PostMedia
├── PostMention
├── PostTopic
└── Poll
```

Community aggregate:

```text
Community
├── Member
├── Flair
└── Champion
```

Conversation aggregate:

```text
Conversation
├── Member
└── Message
```

---

# 62. Tổng kết kiến trúc

Core của hệ thống có thể hình dung như sau:

```text
                     ┌──────────────┐
                     │     USER     │
                     └──────┬───────┘
                            │
        ┌───────────────────┼─────────────────────┐
        │                   │                     │
        ▼                   ▼                     ▼
 SOCIAL GRAPH             POSTS              COMMUNITY
        │                   │                     │
        │            ┌──────┼───────┐             │
        │            │      │       │             │
        │            ▼      ▼       ▼             │
        │          TOPIC   POLL   MEDIA            │
        │                   │                     │
        └──────────────┐    │    ┌────────────────┘
                       ▼    ▼    ▼
                     CUSTOM FEED
                           │
                           ▼
                       FEED VIEW


USER
 │
 ▼
CONVERSATION
 │
 ▼
MESSAGE
 │
 ├── MEDIA
 └── REACTION


USER ACTIONS
 │
 ├── NOTIFICATION
 ├── MODERATION
 └── ANALYTICS
```

Kiến trúc này giữ `User` và `Post` là hai hub chính.

Các domain còn lại mở rộng xung quanh hai entity này.

---

# 63. Định hướng triển khai

## Phase 1 — Core

- Auth.
- User/Profile.
- Follow.
- Post.
- Reply.
- Like.
- Repost.
- Bookmark.

## Phase 2 — Content

- Media.
- Topic.
- Poll.
- Quote.
- Mention.

## Phase 3 — Community

- Community.
- Member.
- Role.
- Flair.
- Champion.

## Phase 4 — Feed

- Custom Feed.
- Topic/User feed.
- Saved feed.

## Phase 5 — Messaging

- Conversation.
- Message.
- Media.
- Reaction.

## Phase 6 — Safety

- Notification.
- Report.
- Block.
- Mute.
- Restrict.
- Hidden post.

## Phase 7 — Analytics / Scale

- View tracking.
- Link tracking.
- Cache.
- Domain event.
- Queue.
- Feed optimization.

---

# 64. Kết luận

ERD hiện tại đã có nền tảng khá đầy đủ cho một Threads clone ở mức đồ án hoặc production prototype.

Ba entity đóng vai trò trung tâm nhất là:

```text
users
posts
communities
```

Trong đó:

- `users` là trung tâm identity và social graph.
- `posts` là trung tâm content.
- `communities` tạo layer grouping/social space.

Messaging là một subsystem tương đối độc lập:

```text
conversations
→ conversation_members
→ messages
→ media / reactions
```

Feed là một lớp tổng hợp dữ liệu từ:

```text
users
topics
posts
communities
```

Notification, moderation và analytics đóng vai trò cross-cutting concerns.

Thiết kế phù hợp nhất ở giai đoạn hiện tại là:

```text
Client
   ↓
REST API
   ↓
Modular Monolith
   ↓
Relational Database
   +
Object Storage
```

Sau này khi traffic lớn mới cân nhắc tách:

```text
Post Service
Feed Service
Messaging Service
Notification Service
Media Service
```

thành các service độc lập.
