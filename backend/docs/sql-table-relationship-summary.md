# Bang thiet ke SQL va khoa lien ket

| STT | Bang | Khoa chinh | Khoa ngoai / Noi khoa | Kieu quan he | Mo ta |
| --- | --- | --- | --- | --- | --- |
| 1 | `users` | `id` | - | Bang trung tam | Luu tai khoan nguoi dung: username, email, password, trang thai active/private/verified. |
| 2 | `profiles` | `user_id` | `user_id` -> `users(id)` | `users` 1-1 `profiles` | Luu thong tin ho so, avatar, bio, website va counter follower/following/post. |
| 3 | `profile_links` | `id` | `user_id` -> `users(id)` | `users` 1-N `profile_links` | Mot user co nhieu link ca nhan. |
| 4 | `follows` | `(follower_id, following_id)` | `follower_id` -> `users(id)`, `following_id` -> `users(id)` | `users` N-N `users` | Bieu dien quan he user A theo doi user B. |
| 5 | `follow_requests` | `(requester_id, target_id)` | `requester_id` -> `users(id)`, `target_id` -> `users(id)` | `users` N-N `users` | Luu yeu cau follow doi voi tai khoan private. |
| 6 | `blocks` | `(blocker_id, blocked_id)` | `blocker_id` -> `users(id)`, `blocked_id` -> `users(id)` | `users` N-N `users` | Luu quan he chan nguoi dung. |
| 7 | `mutes` | `(user_id, muted_user_id)` | `user_id` -> `users(id)`, `muted_user_id` -> `users(id)` | `users` N-N `users` | Luu quan he tat tieng nguoi dung. |
| 8 | `posts` | `id` | `user_id` -> `users(id)`, `parent_post_id` -> `posts(id)`, `quoted_post_id` -> `posts(id)` | `users` 1-N `posts`, `posts` self-reference | Luu bai viet, reply va quote. Reply dung `parent_post_id`, quote dung `quoted_post_id`. |
| 9 | `post_media` | `id` | `post_id` -> `posts(id)` | `posts` 1-N `post_media` | Luu anh/video/gif cua bai viet. |
| 10 | `post_likes` | `(user_id, post_id)` | `user_id` -> `users(id)`, `post_id` -> `posts(id)` | `users` N-N `posts` | Moi user chi like mot post mot lan. |
| 11 | `reposts` | `(user_id, post_id)` | `user_id` -> `users(id)`, `post_id` -> `posts(id)` | `users` N-N `posts` | Luu hanh dong dang lai bai viet. |
| 12 | `bookmarks` | `(user_id, post_id)` | `user_id` -> `users(id)`, `post_id` -> `posts(id)` | `users` N-N `posts` | Luu bai viet user da danh dau. |
| 13 | `post_mentions` | `(post_id, mentioned_user_id)` | `post_id` -> `posts(id)`, `mentioned_user_id` -> `users(id)` | `posts` N-N `users` | Luu cac user duoc nhac ten trong bai viet. |
| 14 | `topics` | `id` | - | Bang danh muc | Luu hashtag/topic cua he thong. |
| 15 | `post_topics` | `(post_id, topic_id)` | `post_id` -> `posts(id)`, `topic_id` -> `topics(id)` | `posts` N-N `topics` | Gan topic/hashtag cho bai viet. |
| 16 | `user_topics` | `(user_id, topic_id)` | `user_id` -> `users(id)`, `topic_id` -> `topics(id)` | `users` N-N `topics` | Luu topic ma user quan tam. |
| 17 | `polls` | `id` | `post_id` -> `posts(id)` | `posts` 1-0..1 `polls` | Mot bai viet co the co mot poll. |
| 18 | `poll_options` | `id` | `poll_id` -> `polls(id)` | `polls` 1-N `poll_options` | Luu cac lua chon cua poll. |
| 19 | `poll_votes` | `(poll_id, option_id, user_id)` | `(poll_id, option_id)` -> `poll_options(poll_id, id)`, `user_id` -> `users(id)` | `users` N-N `poll_options` | Luu phieu vote, trigger chan vote nhieu option neu poll single-choice. |
| 20 | `communities` | `id` | `owner_id` -> `users(id)` | `users` 1-N `communities` | Luu cong dong do user tao/quan ly. |
| 21 | `community_members` | `(community_id, user_id)` | `community_id` -> `communities(id)`, `user_id` -> `users(id)` | `communities` N-N `users` | Luu thanh vien cong dong va role MEMBER/MODERATOR/ADMIN. |
| 22 | `community_join_requests` | `(community_id, user_id)` | `community_id` -> `communities(id)`, `user_id` -> `users(id)` | `communities` N-N `users` | Luu yeu cau tham gia cong dong private. |
| 23 | `community_posts` | `(community_id, post_id)` | `community_id` -> `communities(id)`, `post_id` -> `posts(id)`, `(community_id, flair_id)` -> `community_flairs(community_id, id)` | `communities` N-N `posts` | Gan bai viet vao cong dong va gan flair neu co. |
| 24 | `community_flairs` | `id` | `community_id` -> `communities(id)` | `communities` 1-N `community_flairs` | Luu nhan phan loai bai viet trong tung cong dong. |
| 25 | `custom_feeds` | `id` | `owner_id` -> `users(id)` | `users` 1-N `custom_feeds` | Luu bang tin tuy chinh cua user. |
| 26 | `feed_topics` | `(feed_id, topic_id)` | `feed_id` -> `custom_feeds(id)`, `topic_id` -> `topics(id)` | `custom_feeds` N-N `topics` | Feed lay noi dung theo topic. |
| 27 | `feed_users` | `(feed_id, user_id)` | `feed_id` -> `custom_feeds(id)`, `user_id` -> `users(id)` | `custom_feeds` N-N `users` | Feed lay noi dung theo user. |
| 28 | `saved_feeds` | `(user_id, feed_id)` | `user_id` -> `users(id)`, `feed_id` -> `custom_feeds(id)` | `users` N-N `custom_feeds` | User luu feed cong khai cua nguoi khac. |
| 29 | `conversations` | `id` | `creator_id` -> `users(id)` | `users` 1-N `conversations` | Luu phong chat direct/group. |
| 30 | `conversation_members` | `(conversation_id, user_id)` | `conversation_id` -> `conversations(id)`, `user_id` -> `users(id)`, `last_read_message_id` -> `messages(id)` | `conversations` N-N `users` | Luu thanh vien hoi thoai va tin nhan da doc gan nhat. |
| 31 | `messages` | `id` | `conversation_id` -> `conversations(id)`, `sender_id` -> `users(id)`, `reply_to_message_id` -> `messages(id)` | `conversations` 1-N `messages`, `messages` self-reference | Luu tin nhan va reply tin nhan. |
| 32 | `message_media` | `id` | `message_id` -> `messages(id)` | `messages` 1-N `message_media` | Luu file media dinh kem tin nhan. |
| 33 | `message_reactions` | `(message_id, user_id, reaction)` | `message_id` -> `messages(id)`, `user_id` -> `users(id)` | `messages` N-N `users` | Luu reaction cua user tren tin nhan. |
| 34 | `notifications` | `id` | `user_id` -> `users(id)`, `actor_id` -> `users(id)`, `post_id` -> `posts(id)`, `message_id` -> `messages(id)`, `community_id` -> `communities(id)` | `users` 1-N `notifications` | Luu thong bao cho like, reply, follow, message, community. |
| 35 | `reports` | `id` | `reporter_id` -> `users(id)`, `reported_user_id` -> `users(id)`, `reported_post_id` -> `posts(id)` | `users/posts` 1-N `reports` | Luu bao cao vi pham voi trang thai xu ly. |
| 36 | `hidden_posts` | `(user_id, post_id)` | `user_id` -> `users(id)`, `post_id` -> `posts(id)` | `users` N-N `posts` | User an bai viet khoi trai nghiem ca nhan. |
| 37 | `post_views` | `id` | `post_id` -> `posts(id)`, `user_id` -> `users(id)` | `posts` 1-N `post_views` | Luu luot xem bai viet, cho phep anonymous view khi `user_id` null. |
| 38 | `link_clicks` | `id` | `post_id` -> `posts(id)`, `user_id` -> `users(id)` | `posts` 1-N `link_clicks` | Luu luot click link trong bai viet. |

