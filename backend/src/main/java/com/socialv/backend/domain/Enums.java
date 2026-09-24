package com.socialv.backend.domain;

public final class Enums {
    private Enums() {
    }

    public enum PostVisibility { PUBLIC, FOLLOWERS, MENTIONED }
    public enum InteractionPermission { EVERYONE, FOLLOWERS, MENTIONED, NONE }
    public enum MediaType { IMAGE, VIDEO, GIF }
    public enum CommunityRole { MEMBER, MODERATOR, ADMIN }
    public enum ConversationType { DIRECT, GROUP }
    public enum ConversationRole { OWNER, ADMIN, MEMBER }
    public enum NotificationType { LIKE, REPLY, FOLLOW, REPOST, QUOTE, MENTION, MESSAGE, COMMUNITY }
    public enum ReportReason { SPAM, HARASSMENT, HATE, MISINFORMATION, VIOLENCE, OTHER }
    public enum ReportStatus { PENDING, REVIEWED, REJECTED, RESOLVED }
    public enum RequestStatus { PENDING, ACCEPTED, REJECTED }
}
