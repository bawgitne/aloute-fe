package com.socialv.backend.domain;

import com.socialv.backend.common.BaseEntity;
import com.socialv.backend.domain.Enums.InteractionPermission;
import com.socialv.backend.domain.Enums.PostVisibility;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "posts")
public class Post extends BaseEntity {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_post_id")
    private Post parentPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quoted_post_id")
    private Post quotedPost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostVisibility visibility = PostVisibility.PUBLIC;

    @Enumerated(EnumType.STRING)
    @Column(name = "reply_permission", nullable = false)
    private InteractionPermission replyPermission = InteractionPermission.EVERYONE;

    @Enumerated(EnumType.STRING)
    @Column(name = "quote_permission", nullable = false)
    private InteractionPermission quotePermission = InteractionPermission.EVERYONE;

    @Column(name = "like_count", nullable = false)
    private long likeCount;

    @Column(name = "reply_count", nullable = false)
    private long replyCount;

    @Column(name = "repost_count", nullable = false)
    private long repostCount;

    @Column(name = "quote_count", nullable = false)
    private long quoteCount;

    @Column(name = "view_count", nullable = false)
    private long viewCount;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;
}
