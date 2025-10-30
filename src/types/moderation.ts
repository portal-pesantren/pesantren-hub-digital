// Enhanced Data Models for Moderation System v2.0

export type ContentType = "news" | "article" | "photo" | "video" | "comment";
export type ModerationStatus = "pending" | "in-progress" | "approved" | "rejected" | "flagged";
export type Priority = "low" | "medium" | "high" | "urgent";
export type DeliveryChannel = "web" | "email" | "sms" | "push";

export interface ModerationItemEnhanced {
  id: number;
  type: ContentType;
  title: string;
  pondok: string;
  pondokId: number;
  reason: string;
  status: ModerationStatus;
  submittedDate: string;
  moderatedDate?: string;
  moderatorName?: string;
  priority: Priority;
  contentExcerpt?: string;
  fullContent?: string;

  // Enhanced fields
  contentUrl?: string;
  mimeType?: string;
  fileSize?: number;
  aiScore?: number; // 0-100 safety score
  flaggedKeywords?: string[];
  reviewerNotes?: string;
  escalationLevel: number;
  autoApproved?: boolean;
  lastModified?: string;
  version: number;
  createdBy?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ContentPreview {
  url?: string;
  thumbnail?: string;
  duration?: number; // for videos in seconds
  dimensions?: { width: number; height: number };
  textPreview?: string;
  mediaType: ContentType;
}

export interface ModerationAction {
  id: number;
  itemId: number;
  action: "approve" | "reject" | "flag" | "escalate" | "request_changes";
  moderatorName: string;
  timestamp: string;
  notes?: string;
  previousStatus: ModerationStatus;
  newStatus: ModerationStatus;
}

export interface ModerationRule {
  id: number;
  name: string;
  description: string;
  conditions: {
    contentType?: ContentType[];
    keywords?: string[];
    minAiScore?: number;
    maxFileSize?: number;
    escalationLevel?: number;
  };
  actions: {
    autoApprove?: boolean;
    escalate?: boolean;
    notifyModerator?: boolean;
    requireReview?: boolean;
  };
  enabled: boolean;
  createdAt: string;
  createdBy: string;
}

export interface ModerationAnalytics {
  totalItems: number;
  pendingItems: number;
  approvedItems: number;
  rejectedItems: number;
  flaggedItems: number;
  averageResponseTime: number; // in hours
  moderatorPerformance: {
    moderatorName: string;
    itemsReviewed: number;
    averageTime: number;
    approvalRate: number;
  }[];
  contentTypeBreakdown: {
    type: ContentType;
    count: number;
    approvalRate: number;
  }[];
  weeklyTrends: {
    week: string;
    submitted: number;
    approved: number;
    rejected: number;
  }[];
}

export interface ModerationFilter {
  search: string;
  type: ContentType | "all";
  status: ModerationStatus | "all";
  priority: Priority | "all";
  pondok: string;
  dateRange: {
    from?: string;
    to?: string;
  };
  moderator?: string;
  aiScoreRange?: {
    min: number;
    max: number;
  };
}

export interface ModerationQueue {
  id: string;
  name: string;
  description: string;
  filters: ModerationFilter;
  assignedModerators: string[];
  autoRouting: boolean;
  priority: number;
}

// AI Content Analysis Types
export interface AIContentAnalysis {
  id: number;
  itemId: number;
  timestamp: string;
  safetyScore: number; // 0-100
  categories: {
    spam: number;
    violence: number;
    adult: number;
    hate: number;
    misinformation: number;
    copyright: number;
  };
  flaggedPhrases: string[];
  suggestions: string[];
  confidence: number; // 0-100
}

export interface ContentEscalation {
  id: number;
  itemId: number;
  escalatedBy: string;
  escalatedTo: string;
  reason: string;
  priority: Priority;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}