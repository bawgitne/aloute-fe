CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE post_visibility AS ENUM ('PUBLIC', 'FOLLOWERS', 'MENTIONED');
CREATE TYPE interaction_permission AS ENUM ('EVERYONE', 'FOLLOWERS', 'MENTIONED', 'NONE');
CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO', 'GIF');
CREATE TYPE community_role AS ENUM ('MEMBER', 'MODERATOR', 'ADMIN');
CREATE TYPE conversation_type AS ENUM ('DIRECT', 'GROUP');
CREATE TYPE conversation_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
CREATE TYPE notification_type AS ENUM ('LIKE', 'REPLY', 'FOLLOW', 'REPOST', 'QUOTE', 'MENTION', 'MESSAGE', 'COMMUNITY');
CREATE TYPE report_reason AS ENUM ('SPAM', 'HARASSMENT', 'HATE', 'MISINFORMATION', 'VIOLENCE', 'OTHER');
CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'REJECTED', 'RESOLVED');
CREATE TYPE request_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(40) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_users_username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,40}$')
);

CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(120) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    website_url TEXT,
    followers_count BIGINT NOT NULL DEFAULT 0 CHECK (followers_count >= 0),
    following_count BIGINT NOT NULL DEFAULT 0 CHECK (following_count >= 0),
    posts_count BIGINT NOT NULL DEFAULT 0 CHECK (posts_count >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profile_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    url TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    UNIQUE (user_id, position)
);

CREATE TABLE follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT ck_follows_no_self CHECK (follower_id <> following_id)
);

CREATE TABLE follow_requests (
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status request_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at TIMESTAMPTZ,
    PRIMARY KEY (requester_id, target_id),
    CONSTRAINT ck_follow_requests_no_self CHECK (requester_id <> target_id)
);

CREATE TABLE blocks (
    blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT ck_blocks_no_self CHECK (blocker_id <> blocked_id)
);

CREATE TABLE mutes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    muted_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, muted_user_id),
    CONSTRAINT ck_mutes_no_self CHECK (user_id <> muted_user_id)
);

CREATE TABLE restricted_users (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restricted_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, restricted_user_id),
    CONSTRAINT ck_restricted_users_no_self CHECK (user_id <> restricted_user_id)
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
    quoted_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
    visibility post_visibility NOT NULL DEFAULT 'PUBLIC',
    reply_permission interaction_permission NOT NULL DEFAULT 'EVERYONE',
    quote_permission interaction_permission NOT NULL DEFAULT 'EVERYONE',
    like_count BIGINT NOT NULL DEFAULT 0 CHECK (like_count >= 0),
    reply_count BIGINT NOT NULL DEFAULT 0 CHECK (reply_count >= 0),
    repost_count BIGINT NOT NULL DEFAULT 0 CHECK (repost_count >= 0),
    quote_count BIGINT NOT NULL DEFAULT 0 CHECK (quote_count >= 0),
    view_count BIGINT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE post_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    type media_type NOT NULL,
    media_url TEXT NOT NULL,
    width INTEGER CHECK (width IS NULL OR width > 0),
    height INTEGER CHECK (height IS NULL OR height > 0),
    duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    position INTEGER NOT NULL DEFAULT 0,
    UNIQUE (post_id, position)
);

CREATE TABLE post_likes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE reposts (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE bookmarks (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE post_mentions (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    mentioned_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, mentioned_user_id)
);

CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    post_count BIGINT NOT NULL DEFAULT 0 CHECK (post_count >= 0)
);

CREATE TABLE post_topics (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, topic_id)
);

CREATE TABLE user_topics (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, topic_id)
);

CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    allow_multiple BOOLEAN NOT NULL DEFAULT FALSE,
    total_votes BIGINT NOT NULL DEFAULT 0 CHECK (total_votes >= 0),
    expires_at TIMESTAMPTZ
);

CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    vote_count BIGINT NOT NULL DEFAULT 0 CHECK (vote_count >= 0),
    position INTEGER NOT NULL DEFAULT 0,
    UNIQUE (poll_id, id),
    UNIQUE (poll_id, position)
);

CREATE TABLE poll_votes (
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (poll_id, option_id, user_id),
    CONSTRAINT fk_poll_votes_option
        FOREIGN KEY (poll_id, option_id) REFERENCES poll_options(poll_id, id) ON DELETE CASCADE
);

CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    member_count BIGINT NOT NULL DEFAULT 0 CHECK (member_count >= 0),
    post_count BIGINT NOT NULL DEFAULT 0 CHECK (post_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE community_members (
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role community_role NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (community_id, user_id)
);

CREATE TABLE community_join_requests (
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status request_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at TIMESTAMPTZ,
    PRIMARY KEY (community_id, user_id)
);

CREATE TABLE community_posts (
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    flair_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (community_id, post_id)
);

CREATE TABLE community_flairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    title VARCHAR(80) NOT NULL,
    color VARCHAR(20) NOT NULL,
    UNIQUE (community_id, id),
    UNIQUE (community_id, title)
);

ALTER TABLE community_posts
    ADD CONSTRAINT fk_community_posts_flair
        FOREIGN KEY (community_id, flair_id) REFERENCES community_flairs(community_id, id);

CREATE TABLE user_flairs (
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flair_id UUID NOT NULL,
    PRIMARY KEY (community_id, user_id, flair_id),
    CONSTRAINT fk_user_flairs_flair
        FOREIGN KEY (community_id, flair_id) REFERENCES community_flairs(community_id, id) ON DELETE CASCADE
);

CREATE TABLE community_champions (
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (community_id, user_id)
);

CREATE TABLE custom_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE feed_topics (
    feed_id UUID NOT NULL REFERENCES custom_feeds(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY (feed_id, topic_id)
);

CREATE TABLE feed_users (
    feed_id UUID NOT NULL REFERENCES custom_feeds(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (feed_id, user_id)
);

CREATE TABLE saved_feeds (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feed_id UUID NOT NULL REFERENCES custom_feeds(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, feed_id)
);

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type conversation_type NOT NULL,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    group_name VARCHAR(120),
    group_avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE conversation_members (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role conversation_role NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_read_message_id UUID,
    is_muted BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE conversation_members
    ADD CONSTRAINT fk_conversation_members_last_read FOREIGN KEY (last_read_message_id) REFERENCES messages(id) ON DELETE SET NULL;

CREATE TABLE message_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    type media_type NOT NULL,
    media_url TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    UNIQUE (message_id, position)
);

CREATE TABLE message_reactions (
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction VARCHAR(40) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (message_id, user_id, reaction)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type notification_type NOT NULL,
    message TEXT NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    reason report_reason NOT NULL,
    description TEXT,
    status report_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_reports_has_target CHECK (reported_user_id IS NOT NULL OR reported_post_id IS NOT NULL)
);

CREATE TABLE hidden_posts (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE post_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE link_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    url TEXT NOT NULL,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_display_name ON profiles (lower(display_name));
CREATE INDEX idx_follows_follower ON follows (follower_id);
CREATE INDEX idx_follows_following ON follows (following_id);
CREATE INDEX idx_posts_user_created ON posts (user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_parent ON posts (parent_post_id);
CREATE INDEX idx_posts_quoted ON posts (quoted_post_id);
CREATE INDEX idx_posts_created_public ON posts (created_at DESC) WHERE deleted_at IS NULL AND visibility = 'PUBLIC';
CREATE INDEX idx_post_likes_post ON post_likes (post_id);
CREATE INDEX idx_reposts_post ON reposts (post_id);
CREATE INDEX idx_bookmarks_user ON bookmarks (user_id, created_at DESC);
CREATE INDEX idx_post_topics_topic ON post_topics (topic_id);
CREATE INDEX idx_community_members_user ON community_members (user_id);
CREATE INDEX idx_community_posts_community ON community_posts (community_id, created_at DESC);
CREATE INDEX idx_messages_conversation_created ON messages (conversation_id, created_at DESC);
CREATE INDEX idx_notifications_user_created ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, created_at DESC) WHERE is_read = FALSE;
CREATE INDEX idx_reports_status ON reports (status, created_at DESC);
CREATE INDEX idx_post_views_post ON post_views (post_id);
CREATE INDEX idx_link_clicks_post ON link_clicks (post_id);

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_custom_feeds_updated_at BEFORE UPDATE ON custom_feeds FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION sync_follow_counters()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles SET following_count = following_count + 1 WHERE user_id = NEW.follower_id;
        UPDATE profiles SET followers_count = followers_count + 1 WHERE user_id = NEW.following_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE user_id = OLD.follower_id;
        UPDATE profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE user_id = OLD.following_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_follow_counters
AFTER INSERT OR DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION sync_follow_counters();

CREATE OR REPLACE FUNCTION sync_post_counters()
RETURNS trigger AS $$
BEGIN
    IF TG_TABLE_NAME = 'post_likes' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
            RETURN NEW;
        ELSE
            UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
            RETURN OLD;
        END IF;
    ELSIF TG_TABLE_NAME = 'reposts' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE posts SET repost_count = repost_count + 1 WHERE id = NEW.post_id;
            RETURN NEW;
        ELSE
            UPDATE posts SET repost_count = GREATEST(repost_count - 1, 0) WHERE id = OLD.post_id;
            RETURN OLD;
        END IF;
    ELSIF TG_TABLE_NAME = 'posts' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE profiles SET posts_count = posts_count + 1 WHERE user_id = NEW.user_id;
            IF NEW.parent_post_id IS NOT NULL THEN
                UPDATE posts SET reply_count = reply_count + 1 WHERE id = NEW.parent_post_id;
            END IF;
            IF NEW.quoted_post_id IS NOT NULL THEN
                UPDATE posts SET quote_count = quote_count + 1 WHERE id = NEW.quoted_post_id;
            END IF;
            RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE profiles SET posts_count = GREATEST(posts_count - 1, 0) WHERE user_id = OLD.user_id;
            IF OLD.parent_post_id IS NOT NULL THEN
                UPDATE posts SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = OLD.parent_post_id;
            END IF;
            IF OLD.quoted_post_id IS NOT NULL THEN
                UPDATE posts SET quote_count = GREATEST(quote_count - 1, 0) WHERE id = OLD.quoted_post_id;
            END IF;
            RETURN OLD;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_like_counters AFTER INSERT OR DELETE ON post_likes FOR EACH ROW EXECUTE FUNCTION sync_post_counters();
CREATE TRIGGER trg_sync_repost_counters AFTER INSERT OR DELETE ON reposts FOR EACH ROW EXECUTE FUNCTION sync_post_counters();
CREATE TRIGGER trg_sync_post_counters AFTER INSERT OR DELETE ON posts FOR EACH ROW EXECUTE FUNCTION sync_post_counters();

CREATE OR REPLACE FUNCTION sync_community_counters()
RETURNS trigger AS $$
BEGIN
    IF TG_TABLE_NAME = 'community_members' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
            RETURN NEW;
        ELSE
            UPDATE communities SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.community_id;
            RETURN OLD;
        END IF;
    ELSIF TG_TABLE_NAME = 'community_posts' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE communities SET post_count = post_count + 1 WHERE id = NEW.community_id;
            RETURN NEW;
        ELSE
            UPDATE communities SET post_count = GREATEST(post_count - 1, 0) WHERE id = OLD.community_id;
            RETURN OLD;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_community_member_counters AFTER INSERT OR DELETE ON community_members FOR EACH ROW EXECUTE FUNCTION sync_community_counters();
CREATE TRIGGER trg_sync_community_post_counters AFTER INSERT OR DELETE ON community_posts FOR EACH ROW EXECUTE FUNCTION sync_community_counters();

CREATE OR REPLACE FUNCTION sync_poll_vote_counters()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = NEW.option_id;
        UPDATE polls SET total_votes = total_votes + 1 WHERE id = NEW.poll_id;
        RETURN NEW;
    ELSE
        UPDATE poll_options SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = OLD.option_id;
        UPDATE polls SET total_votes = GREATEST(total_votes - 1, 0) WHERE id = OLD.poll_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enforce_single_choice_poll()
RETURNS trigger AS $$
DECLARE
    multiple_allowed BOOLEAN;
BEGIN
    SELECT allow_multiple INTO multiple_allowed FROM polls WHERE id = NEW.poll_id;

    IF multiple_allowed = FALSE AND EXISTS (
        SELECT 1 FROM poll_votes
        WHERE poll_id = NEW.poll_id AND user_id = NEW.user_id
    ) THEN
        RAISE EXCEPTION 'User % already voted in single-choice poll %', NEW.user_id, NEW.poll_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_single_choice_poll
BEFORE INSERT ON poll_votes
FOR EACH ROW EXECUTE FUNCTION enforce_single_choice_poll();

CREATE TRIGGER trg_sync_poll_vote_counters AFTER INSERT OR DELETE ON poll_votes FOR EACH ROW EXECUTE FUNCTION sync_poll_vote_counters();

CREATE OR REPLACE FUNCTION create_like(p_user_id UUID, p_post_id UUID)
RETURNS VOID AS $$
DECLARE
    post_owner UUID;
    inserted_count INTEGER;
BEGIN
    INSERT INTO post_likes(user_id, post_id) VALUES (p_user_id, p_post_id)
    ON CONFLICT DO NOTHING;

    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    IF inserted_count = 0 THEN
        RETURN;
    END IF;

    SELECT user_id INTO post_owner FROM posts WHERE id = p_post_id;
    IF post_owner IS NOT NULL AND post_owner <> p_user_id THEN
        INSERT INTO notifications(user_id, actor_id, type, message, post_id)
        VALUES (post_owner, p_user_id, 'LIKE', 'liked your post', p_post_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_reply(p_user_id UUID, p_parent_post_id UUID, p_content TEXT)
RETURNS UUID AS $$
DECLARE
    reply_id UUID;
    parent_owner UUID;
BEGIN
    INSERT INTO posts(user_id, content, parent_post_id)
    VALUES (p_user_id, p_content, p_parent_post_id)
    RETURNING id INTO reply_id;

    SELECT user_id INTO parent_owner FROM posts WHERE id = p_parent_post_id;
    IF parent_owner IS NOT NULL AND parent_owner <> p_user_id THEN
        INSERT INTO notifications(user_id, actor_id, type, message, post_id)
        VALUES (parent_owner, p_user_id, 'REPLY', 'replied to your post', p_parent_post_id);
    END IF;

    RETURN reply_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION follow_user(p_follower_id UUID, p_following_id UUID)
RETURNS VOID AS $$
DECLARE
    inserted_count INTEGER;
BEGIN
    INSERT INTO follows(follower_id, following_id)
    VALUES (p_follower_id, p_following_id)
    ON CONFLICT DO NOTHING;

    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    IF inserted_count = 0 THEN
        RETURN;
    END IF;

    INSERT INTO notifications(user_id, actor_id, type, message)
    VALUES (p_following_id, p_follower_id, 'FOLLOW', 'started following you');
END;
$$ LANGUAGE plpgsql;
