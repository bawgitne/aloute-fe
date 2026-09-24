package com.socialv.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @Column(name = "user_id")
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "display_name", nullable = false, length = 120)
    private String displayName;

    @Column(columnDefinition = "text")
    private String bio;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "cover_url")
    private String coverUrl;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "followers_count", nullable = false)
    private long followersCount;

    @Column(name = "following_count", nullable = false)
    private long followingCount;

    @Column(name = "posts_count", nullable = false)
    private long postsCount;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
