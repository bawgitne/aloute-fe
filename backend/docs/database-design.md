# Thiet ke du lieu - SocialV

## He QTCSDL duoc chon

Chon **PostgreSQL** cho ban cai dat thuc te vi de tai co nhieu quan he N-N, self-reference, transaction va can enforce constraint o tang database. PostgreSQL cung ho tro tot UUID, enum, trigger, stored procedure va index co dieu kien.

## Pham vi schema da hien thuc

Migration Flyway trong `src/main/resources/db/migration` tao database ban dau cho cac domain:

- Identity/Profile: `users`, `profiles`, `profile_links`.
- Social graph: `follows`, `follow_requests`, `blocks`, `mutes`, `restricted_users`.
- Post: `posts`, `post_media`, `post_likes`, `reposts`, `bookmarks`, `post_mentions`.
- Topic/Poll: `topics`, `post_topics`, `user_topics`, `polls`, `poll_options`, `poll_votes`.
- Community: `communities`, `community_members`, `community_join_requests`, `community_posts`, `community_flairs`, `user_flairs`, `community_champions`.
- Custom feed: `custom_feeds`, `feed_topics`, `feed_users`, `saved_feeds`.
- Messaging: `conversations`, `conversation_members`, `messages`, `message_media`, `message_reactions`.
- Notification/Moderation/Analytics: `notifications`, `reports`, `hidden_posts`, `post_views`, `link_clicks`.

## Quan he chinh

- `users` 1-1 `profiles`.
- `users` 1-N `profile_links`, `posts`, `custom_feeds`, `messages`, `notifications`.
- `users` N-N `users` qua `follows`, `blocks`, `mutes`, `restricted_users`.
- `posts` self-reference qua `parent_post_id` de luu reply va `quoted_post_id` de luu quote.
- `posts` N-N `topics` qua `post_topics`.
- `posts` 1-N `post_media`; `posts` 0..1 `polls`.
- `polls` 1-N `poll_options`; `poll_votes` rang buoc user vote theo cau hinh poll.
- `communities` N-N `users` qua `community_members`.
- `conversations` N-N `users` qua `conversation_members`; `messages` self-reference qua `reply_to_message_id`.

## Soft delete

Da bo tri `deleted_at` cho `posts` va `messages` de giu lich su/audit va khong pha khoa ngoai cua reply, quote, notification, report.

## Trigger va stored procedure

Trigger:

- `set_updated_at`: tu cap nhat `updated_at`.
- `sync_follow_counters`: dong bo `followers_count` va `following_count`.
- `sync_post_counters`: dong bo `posts_count`, `like_count`, `reply_count`, `repost_count`, `quote_count`.
- `sync_community_counters`: dong bo `member_count` va `post_count`.
- `sync_poll_vote_counters`: dong bo `vote_count` va `total_votes`.
- `enforce_single_choice_poll`: chan user vote nhieu option neu `allow_multiple = false`.

Stored procedure/function:

- `create_like(user_id, post_id)`: like bai viet va tao notification.
- `create_reply(user_id, parent_post_id, content)`: tao reply va notification.
- `follow_user(follower_id, following_id)`: follow user va tao notification.

## Index quan trong

- Feed/profile: `posts(user_id, created_at DESC)`, `posts(created_at DESC)` cho public feed.
- Reply/quote: `posts(parent_post_id)`, `posts(quoted_post_id)`.
- Interaction: `post_likes(post_id)`, `reposts(post_id)`, `bookmarks(user_id, created_at DESC)`.
- Social graph: `follows(follower_id)`, `follows(following_id)`.
- Community/message: `community_posts(community_id, created_at DESC)`, `messages(conversation_id, created_at DESC)`.
- Notification/moderation: `notifications(user_id, created_at DESC)`, `notifications(user_id, created_at DESC) WHERE is_read = false`, `reports(status, created_at DESC)`.

## Entity JPA da chuan bi

Module `com.socialv.backend.domain` da co cac entity cot loi de tiep tuc xay API:

- `User`, `Profile`, `ProfileLink`.
- `Post`, `PostMedia`, `Topic`, `Poll`, `PollOption`.
- `Community`.
- `Conversation`, `Message`.
- `Notification`, `Report`.

Lan tiep theo co the bo sung repository/service/controller dua tren cac entity nay.
