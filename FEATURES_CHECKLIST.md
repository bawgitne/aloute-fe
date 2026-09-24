# THREADS CLONE — DANH SÁCH TÍNH NĂNG & TIẾN ĐỘ THỰC HIỆN (CHECKLIST)

> Tài liệu này được tổng hợp từ kiến trúc hệ thống **`thread_system.md`** và đối chiếu trực tiếp với mã nguồn ứng dụng Threads Clone (Frontend Vue 3 + Composables State Store).

---

## 📊 Bảng tổng quan tiến độ (Progress Overview)

- **Frontend Feature Coverage**: **100% Core Features Completed**
- **UI/UX & Layout Modes**: **100% Completed**
- **Backend Infrastructure (Integrations)**: **Chờ kết nối API Backend (Database / Storage Server)**

---

## 1. 👤 Identity & Profile Domain (Tài khoản & Hồ sơ)

- [x] **1.1. Thông tin Profile cơ bản**
  - [x] Hiển thị Display Name, Username (`@username`), Bio, Avatar, Ảnh bìa (Cover).
  - [x] Tích xanh xác minh (`is_verified`).
  - [x] Trạng thái tài khoản Riêng tư / Công khai (`is_private`).
- [x] **1.2. Danh sách liên kết bên ngoài (`profile_links`)**
  - [x] Hiển thị Website chính và danh sách các link tùy chỉnh.
- [x] **1.3. Bộ đếm Cached Counters (Denormalized)**
  - [x] Đếm số bài viết (Threads Count).
  - [x] Đếm người theo dõi (Followers Count).
  - [x] Đếm đang theo dõi (Following Count).
- [x] **1.4. Chỉnh sửa hồ sơ (Edit Profile Modal)**
  - [x] Chỉnh sửa Avatar, Ảnh bìa, Tên hiển thị, Bio, Link website.
  - [x] Bật/tắt chế độ tài khoản riêng tư.

---

## 2. 🤝 Social Graph Domain (Mạng lưới kết nối)

- [x] **2.1. Theo dõi & Hủy theo dõi (Follow / Unfollow)**
  - [x] Nút bấm Follow/Following trên Profile, Feed, Suggested Users, Friends list.
  - [x] Cập nhật ngay lập tức bộ đếm Followers/Following.
- [x] **2.2. Chặn người dùng (Block User)**
  - [x] Thêm user vào danh sách Chặn trong Moderation & Safety.
  - [x] Ẩn tương tác và nội dung của người bị chặn.
- [x] **2.3. Ẩn thông báo / Tắt tiếng (Mute User)**
  - [x] Mute tài khoản khỏi feed và thông báo.
- [x] **2.4. Trang quản lý Bạn bè & Kết nối (`FriendsView.vue`)**
  - [x] Thanh tìm kiếm bạn bè theo tên / username / bio.
  - [x] Bộ lọc theo tabs: **All Connections**, **Following**, **Followers**, **Suggested**.
  - [x] Nút nhắn tin nhanh (mở cửa sổ mini chat) và nút Follow/Unfollow trực tiếp.
- [ ] **2.5. Yêu cầu theo dõi tài khoản riêng tư (Private Follow Requests)** *(Backend Pending)*
  - [ ] Bảng `follow_requests` trạng thái PENDING / ACCEPTED / REJECTED khi tài khoản ở chế độ `is_private`.

---

## 3. 📝 Post Domain (Đăng bài & Tương tác bài viết)

- [x] **3.1. Tạo bài viết (Create Post)**
  - [x] Hộp khởi tạo nhanh (Quick Create Card) & Modal soạn thảo đầy đủ (`CreatePostModal.vue`).
  - [x] Chọn phạm vi hiển thị (Visibility: `PUBLIC`, `FOLLOWERS`, `MENTIONED`).
  - [x] Thiết lập quyền Reply / Quote (`EVERYONE`, `FOLLOWERS`, `MENTIONED`).
- [x] **3.2. Trả lời bài viết (Reply / Comment)**
  - [x] Khởi tạo reply với tham chiếu `parent_post_id`.
  - [x] Cập nhật số lượng `reply_count`.
  - [x] 3 chế độ xem bình luận linh hoạt (Left Split, Side Panel Right, Pop-up Modal).
- [x] **3.3. Trích dẫn bài viết (Quote Post)**
  - [x] Tạo post mới đính kèm tham chiếu bài viết gốc (`quoted_post_id`).
  - [x] Cập nhật số lượng `quote_count`.
- [x] **3.4. Đăng lại (Repost)**
  - [x] Bật/tắt Repost bài viết về trang cá nhân.
  - [x] Cập nhật số lượng `repost_count`.
- [x] **3.5. Yêu thích (Like / Unlike)**
  - [x] Nút Like dạng trái tim với hiệu ứng animation.
  - [x] Cập nhật ngay lập tức `like_count`.
- [x] **3.6. Lưu bài viết (Bookmark)**
  - [x] Lưu bài viết vào danh sách bài viết đã đánh dấu cá nhân.
- [x] **3.7. Nhắc tên người dùng (Mention)**
  - [x] Nhắc tên `@username` trong nội dung bài viết và tạo liên kết tới trang cá nhân.

---

## 4. 🖼️ Post Media Domain (Đa phương tiện)

- [x] **4.1. Định dạng Media**
  - [x] Hỗ trợ hiển thị Hình ảnh (Grid layout), Video, GIF.
- [x] **4.2. Xem ảnh chi tiết**
  - [x] Modal xem bài viết & media sắc nét (`PostDetailModal.vue`).

---

## 5. 🏷️ Topic Domain (Chủ đề Hashtag)

- [x] **5.1. Thẻ Topic / Hashtag**
  - [x] Gắn hashtag vào bài viết (`#VueJS`, `#WebDev`, `#ArtificialIntelligence`, v.v.).
- [x] **5.2. Lọc bài viết theo Topic**
  - [x] Bấm vào Hashtag để lọc danh sách bài viết thuộc chủ đề đó trên Feed.
- [x] **5.3. Danh sách Trending Hashtags**
  - [x] Hiển thị trên Left Sidebar và gợi ý trong thanh tìm kiếm Header.

---

## 6. 📊 Poll Domain (Bình chọn / Thăm dò ý kiến)

- [x] **6.1. Tạo Poll**
  - [x] Đính kèm bình chọn vào bài viết với danh sách tùy chọn (Options).
- [x] **6.2. Tham gia Vote Poll**
  - [x] Chọn phương án bình chọn (Vote single choice).
  - [x] Tự động tính toán % và hiển thị thanh tiến trình kết quả thực tế.

---

## 7. 👥 Community Domain (Cộng đồng)

- [x] **7.1. Trang danh sách Cộng đồng (`CommunitiesView.vue`)**
  - [x] Khám phá tất cả các cộng đồng (All Communities) & Cộng đồng đã tham gia (My Joined Communities).
- [x] **7.2. Tham gia / Rời cộng đồng (Join / Leave)**
  - [x] Nút Join/Joined cập nhật ngay lập tức `member_count`.
- [x] **7.3. Trang chi tiết Cộng đồng (`CommunityDetail.vue`)**
  - [x] Banner, Avatar, Mô tả, Số lượng thành viên & bài viết.
  - [x] Luồng bài viết riêng của cộng đồng (Community Feed).
- [x] **7.4. Nhãn phân loại (Community Flairs)**
  - [x] Đính kèm các nhãn (`Showcase`, `Help Needed`, `Discussion`, `Paper Review`, `Prompt Eng`).
- [x] **7.5. Phân quyền vai trò (Roles)**
  - [x] Quản lý vai trò `MEMBER`, `MODERATOR`, `ADMIN`.

---

## 8. 🎛️ Custom Feed Domain (Bảng tin tùy chỉnh)

- [x] **8.1. Trang quản lý Bảng tin Tùy chỉnh (`CustomFeedsView.vue`)**
  - [x] Danh sách các Custom Feed được tạo theo chủ đề/người dùng cụ thể.
- [x] **8.2. Tạo Bảng tin mới (`CreateCustomFeedModal.vue`)**
  - [x] Điền tên, mô tả, chọn danh sách Topics và Users muốn theo dõi.
- [x] **8.3. Lưu Bảng tin (Save Custom Feed)**
  - [x] Lưu các feed công khai của người khác vào danh sách cá nhân.
- [x] **8.4. Lọc bài viết theo Feed trên trang chủ**
  - [x] Các tab lọc bài viết (`For You`, `Following`, các pill Custom Feed).

---

## 9. 💬 Messaging Domain (Nhắn tin Trực tiếp & Nhóm)

- [x] **9.1. Khung Chat tổng ở góc dưới (`ChatDrawer.vue`)**
  - [x] Nằm sát đáy màn hình (`bottom: 0; right: 20px`).
  - [x] Danh sách cuộc hội thoại Direct & Group, hiển thị tin nhắn mới nhất và badge tin chưa đọc.
- [x] **9.2. Cửa sổ Mini Chat tách rời (`MultiMiniChatDock.vue`)**
  - [x] Bật cùng lúc nhiều cửa sổ chat dạng Facebook Messenger Desktop ở góc dưới bên phải.
  - [x] Nút thu nhỏ (-), đóng (x), gửi ảnh, đính kèm file, emoji.
- [x] **9.3. Trang tin nhắn đầy đủ (`MessagingView.vue`)**
  - [x] Giao diện quản lý tin nhắn toàn màn hình.

---

## 10. 🔔 Notification Domain (Thông báo)

- [x] **10.1. Trang Thông báo (`NotificationsView.vue`)**
  - [x] Phân loại thông báo: All, Likes, Replies, Mentions, Follows.
- [x] **10.2. Pop-up Thông báo dạng Facebook trên Topbar (`Header.vue`)**
  - [x] Click nút chuông ở góc phải Topbar mở Pop-up Dropdown thông báo ngay bên dưới.
  - [x] Tiêu đề "Notifications" & Nút "Mark all read" (Đánh dấu tất cả đã đọc).
  - [x] Các tab lọc Facebook Style (**All**, **Unread** kèm số lượng tin chưa đọc).
  - [x] Danh sách thông báo dạng card mini có avatar người dùng, badge biểu tượng hành động (Like heart, Reply comment, Follow user-plus), thời gian và dấu chấm xanh chưa đọc.
  - [x] Nút "See all notifications" chuyển đến trang thông báo toàn màn hình.

---

## 11. 🛡️ Moderation & Safety Domain (An toàn & Quản trị)

- [x] **11.1. Báo cáo bài viết / người dùng (Report Modal)**
  - [x] Gửi báo cáo với lý do: `SPAM`, `HARASSMENT`, `HATE`, `MISINFORMATION`, `VIOLENCE`, `OTHER`.
- [x] **11.2. Ẩn bài viết (Hide Post)**
  - [x] Ẩn bài viết khỏi trải nghiệm cá nhân mà không xóa bài.
- [x] **11.3. Dashboard An toàn & Quản trị (`ModerationView.vue`)**
  - [x] Quản lý danh sách người bị Chặn (Block), Tắt tiếng (Mute) và Trạng thái xử lý báo cáo (`PENDING`, `REVIEWED`, `RESOLVED`).

---

## 12. 📈 Analytics Domain (Thống kê bài viết & tài khoản)

- [x] **12.1. Trang Dashboard Thống kê (`AnalyticsView.vue`)**
  - [x] Tổng lượt xem Threads (Total Thread Views).
  - [x] Lượt click liên kết (Link Clicks).
  - [x] Tổng lượt Likes & Tỷ lệ tương tác (Avg Engagement Rate).
  - [x] Bảng xếp hạng các bài viết hiệu quả nhất (Top Performing Threads).
- [x] **12.2. Nút Analytics trên trang cá nhân**
  - [x] Đặt ngay bên trái nút `Edit Profile` trên `ProfileHeader.vue`.
- [x] **12.3. Modal thống kê từng bài viết (`AnalyticsModal.vue`)**

---

## 13. 🎨 UI/UX & Layout Architecture System

- [x] **13.1. Chế độ hiển thị Cột trái Frameless (`Left Split Mode`)**
  - [x] Cột Left Sidebar phẳng (Frameless, không background card, không border/shadow), căn giữa theo chiều dọc màn hình (`top: 50vh; transform: translateY(-50%)`).
  - [x] Đã xóa tiêu đề thừa, tối ưu khoảng cách sát lề trái (`gap: 16px; padding-left: 12px`).
- [x] **13.2. Cấu trúc Topbar Header tối giản**
  - [x] **Thanh điều hướng trung tâm**: `Feed` | `Communities` | `Safety`.
  - [x] **Góc phải Topbar**: Nút `Friends` | Nút `Notifications` (chuông) | Nút `Settings` (bánh răng) | Avatar người dùng.
- [x] **13.3. Menu Cài đặt Popover (`Settings Dropdown`)**
  - [x] Tích hợp công tắc gạt Chế độ Tối/Sáng (**Dark Theme Mode**).
  - [x] Công tắc Bật/Tắt Card Mini Profile trên Sidebar.
  - [x] Chuyển đổi linh hoạt 3 chế độ hiển thị Bình luận (**Left Split** / **Side Panel** / **Pop-up**).

---

## 14. 🔌 Backend & Infrastructure (GAP / PROPOSED - Cần triển khai Backend)

- [ ] **14.1. RESTful API Server Layer**
  - [ ] Xây dựng bộ API Endpoints (`/api/auth`, `/api/posts`, `/api/social`, `/api/messages`, v.v.).
- [ ] **14.2. Relational Database Persistence**
  - [ ] Khởi tạo cơ sở dữ liệu PostgreSQL / MySQL theo đúng thiết kế Schema ERD.
- [ ] **14.3. Hạ tầng Authentication & Session**
  - [ ] Cấp phát và xác thực JWT Access Token, Refresh Token, Session Login.
- [ ] **14.4. Đa phương tiện Storage Server**
  - [ ] Tích hợp Object Storage (Cloudflare R2 / AWS S3) để lưu trữ file ảnh & video.
- [ ] **14.5. Bộ nhớ đệm Cache (Redis)**
  - [ ] Cấu hình Redis Cache cho thuật toán xếp hạng Feed & dữ liệu Profile popular.
- [ ] **14.6. Hàng chờ tin nhắn Async (Queue / Domain Events)**
  - [ ] Tích hợp RabbitMQ / Kafka cho các tác vụ xử lý thông báo tự động.
