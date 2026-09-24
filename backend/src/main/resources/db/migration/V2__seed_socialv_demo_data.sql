INSERT INTO users (id, username, email, password_hash, is_verified, is_private)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'alex_dev', 'alex@threads.app', '$2a$10$demo', TRUE, FALSE),
    ('00000000-0000-0000-0000-000000000002', 'sarah_ux', 'sarah@threads.app', '$2a$10$demo', TRUE, FALSE),
    ('00000000-0000-0000-0000-000000000003', 'marcus_ai', 'marcus@threads.app', '$2a$10$demo', TRUE, FALSE),
    ('00000000-0000-0000-0000-000000000004', 'elena_rodriguez', 'elena@threads.app', '$2a$10$demo', FALSE, FALSE);

INSERT INTO profiles (user_id, display_name, bio, avatar_url, cover_url, website_url)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Alex Rivera', 'Fullstack Architect & UI Enthusiast. Building the modern web with Vue & Vite.', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80', 'https://alexrivera.dev'),
    ('00000000-0000-0000-0000-000000000002', 'Sarah Chen', 'Product Designer @SocialV | Design Systems & Micro-interactions', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', NULL, NULL),
    ('00000000-0000-0000-0000-000000000003', 'Marcus Vance', 'AI Researcher & LLM Specialist. Writing about agents & neural nets.', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', NULL, NULL),
    ('00000000-0000-0000-0000-000000000004', 'Elena Rodriguez', 'Frontend Specialist & Vue.js Core Advocate', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', NULL, NULL);

INSERT INTO profile_links (user_id, title, url, position)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Portfolio', 'https://alexrivera.dev', 0),
    ('00000000-0000-0000-0000-000000000001', 'GitHub', 'https://github.com/alexrivera', 1);

INSERT INTO topics (id, name, slug, post_count)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'VueJS', 'vuejs', 1420),
    ('10000000-0000-0000-0000-000000000002', 'WebDev', 'webdev', 3890),
    ('10000000-0000-0000-0000-000000000003', 'ArtificialIntelligence', 'artificialintelligence', 8900),
    ('10000000-0000-0000-0000-000000000004', 'UIUXDesign', 'uiuxdesign', 2310),
    ('10000000-0000-0000-0000-000000000005', 'Cloudflare', 'cloudflare', 1120);

INSERT INTO follows (follower_id, following_id)
VALUES
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
    ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001');

INSERT INTO communities (id, owner_id, name, slug, description, avatar_url, cover_url, is_private)
VALUES
    ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Vue Developers Hub', 'vue-devs', 'The premier community for Vue 3, Vite, Pinia, and Nuxt developers.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80', FALSE),
    ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'AI & Machine Learning Guild', 'ai-ml-guild', 'Exploring LLMs, agentic coding, diffusion models, and future AI tech.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80', TRUE);

INSERT INTO community_members (community_id, user_id, role)
VALUES
    ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ADMIN'),
    ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'MODERATOR'),
    ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'ADMIN');

INSERT INTO community_join_requests (community_id, user_id)
VALUES ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004');

INSERT INTO community_flairs (id, community_id, title, color)
VALUES
    ('21000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Showcase', '#00d084'),
    ('21000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Help Needed', '#ffb800'),
    ('21000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'Discussion', '#50b5ff'),
    ('21000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'Paper Review', '#6f42c1'),
    ('21000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', 'Prompt Eng', '#ff5252');

INSERT INTO posts (id, user_id, content, visibility, reply_permission, quote_permission, view_count)
VALUES
    ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Just finalized the design tokens for our new SocialV design system update!', 'PUBLIC', 'EVERYONE', 'EVERYONE', 1240),
    ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Which AI architecture pattern will dominate autonomous web applications?', 'PUBLIC', 'EVERYONE', 'EVERYONE', 3420),
    ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'This AI survey from @marcus_ai is spot on.', 'PUBLIC', 'EVERYONE', 'EVERYONE', 980);

UPDATE posts SET quoted_post_id = '30000000-0000-0000-0000-000000000002'
WHERE id = '30000000-0000-0000-0000-000000000003';

INSERT INTO post_topics (post_id, topic_id)
VALUES
    ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004'),
    ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003'),
    ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'),
    ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005');

INSERT INTO community_posts (community_id, post_id, flair_id)
VALUES
    ('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '21000000-0000-0000-0000-000000000004'),
    ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '21000000-0000-0000-0000-000000000001');

INSERT INTO post_media (post_id, type, media_url, position)
VALUES ('30000000-0000-0000-0000-000000000001', 'IMAGE', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80', 0);

INSERT INTO polls (id, post_id, question, allow_multiple)
VALUES ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Which framework is best for stateful agentic workflows?', FALSE);

INSERT INTO poll_options (id, poll_id, text, position)
VALUES
    ('41000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Cloudflare Agents SDK & Durable Objects', 0),
    ('41000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'LangChain & Autonomous Loops', 1),
    ('41000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'Custom Stateful WebSocket Servers', 2);

INSERT INTO custom_feeds (id, owner_id, name, description, is_private)
VALUES
    ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Tech & Architecture Feed', 'Curated posts from top frontend engineers and AI researchers.', FALSE),
    ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Design & UX Daily', 'Micro-animations, Figma tips, and UI breakdowns.', FALSE);

INSERT INTO feed_topics (feed_id, topic_id)
VALUES
    ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
    ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
    ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005'),
    ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004');

INSERT INTO feed_users (feed_id, user_id)
VALUES
    ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
    ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
    ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002');

INSERT INTO saved_feeds (user_id, feed_id)
VALUES
    ('00000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001'),
    ('00000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002');

SELECT create_like('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001');
SELECT create_like('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003');
SELECT create_reply('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Love the contrast ratio on those secondary action buttons Sarah!');

INSERT INTO conversations (id, type, creator_id)
VALUES ('60000000-0000-0000-0000-000000000001', 'DIRECT', '00000000-0000-0000-0000-000000000001');

INSERT INTO conversation_members (conversation_id, user_id, role)
VALUES
    ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MEMBER'),
    ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'MEMBER');

INSERT INTO messages (conversation_id, sender_id, content)
VALUES
    ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Hey Alex! Are you ready for the Vue 3 component migration?'),
    ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Yes! Just pushed the Vite setup and style system.');
