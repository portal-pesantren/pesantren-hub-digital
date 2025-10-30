// Enhanced Data Models for Notification System v2.0

export type NotificationType = "success" | "warning" | "info" | "error" | "announcement" | "reminder";
export type NotificationAudience = "all" | "pondok" | "users" | "role" | "custom" | "segment";
export type NotificationStatus = "draft" | "scheduled" | "queued" | "sending" | "sent" | "failed" | "cancelled";
export type DeliveryChannel = "web" | "email" | "sms" | "push" | "whatsapp";

export interface NotificationEnhanced {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  audience: NotificationAudience;
  status: NotificationStatus;
  createdAt: string;
  sentAt?: string;
  scheduledAt?: string;

  // Enhanced fields
  priority: "low" | "medium" | "high" | "urgent";
  channels: DeliveryChannel[];
  targetSegments?: string[];
  targetRoles?: string[];
  targetPondoks?: number[];
  excludedUsers?: number[];
  metadata?: Record<string, any>;

  // Analytics
  totalRecipients?: number;
  deliveredCount?: number;
  openCount?: number;
  clickCount?: number;
  bounceCount?: number;
  openRate?: number;
  clickRate?: number;

  // Content
  imageUrl?: string;
  actionUrl?: string;
  actionLabel?: string;
  templateId?: string;
  variables?: Record<string, any>;

  // Scheduling
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: string;
  };

  // Delivery tracking
  deliveryStatus?: {
    [key in DeliveryChannel]: {
      total: number;
      sent: number;
      delivered: number;
      failed: number;
      pending: number;
    };
  };

  createdBy: string;
  lastModified?: string;
  version: number;
}

export interface NotificationTemplate {
  id: number;
  name: string;
  description: string;
  subject?: string;
  body: string;
  type: NotificationType;
  variables: NotificationVariable[];
  channels: DeliveryChannel[];
  isDefault: boolean;
  createdAt: string;
  createdBy: string;
  lastModified?: string;
}

export interface NotificationVariable {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "boolean" | "select";
  required: boolean;
  defaultValue?: any;
  options?: string[]; // for select type
  description?: string;
}

export interface UserNotificationPreferences {
  userId: number;
  channels: {
    [key in DeliveryChannel]: {
      enabled: boolean;
      quietHours?: {
        start: string; // HH:mm
        end: string;   // HH:mm
        timezone: string;
      };
    };
  };
  categories: {
    [key in NotificationType]: {
      email: boolean;
      push: boolean;
      sms: boolean;
      web: boolean;
    };
  };
  frequency: "immediate" | "hourly" | "daily" | "weekly";
  quietHoursEnabled: boolean;
}

export interface NotificationCampaign {
  id: number;
  name: string;
  description: string;
  notifications: NotificationEnhanced[];
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  startDate?: string;
  endDate?: string;
  budget?: number;
  targetAudience: {
    estimatedSize: number;
    segments: string[];
    filters: Record<string, any>;
  };
  performance: {
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    totalConversions?: number;
    costPerResult?: number;
  };
  createdBy: string;
  createdAt: string;
}

export interface NotificationAnalytics {
  period: {
    start: string;
    end: string;
  };
  overview: {
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    averageCost?: number;
  };
  byChannel: {
    channel: DeliveryChannel;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    cost?: number;
  }[];
  byType: {
    type: NotificationType;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  }[];
  byAudience: {
    audience: NotificationAudience;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  }[];
  timeSeries: {
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }[];
  topPerforming: {
    notificationId: number;
    title: string;
    openRate: number;
    clickRate: number;
    delivered: number;
  }[];
  engagement: {
    peakHours: { hour: number; rate: number }[];
    peakDays: { day: string; rate: number }[];
    deviceBreakdown: {
      desktop: number;
      mobile: number;
      tablet: number;
    };
  };
}

export interface NotificationDelivery {
  id: string;
  notificationId: number;
  userId: number;
  channel: DeliveryChannel;
  status: "pending" | "sent" | "delivered" | "opened" | "clicked" | "failed" | "bounced";
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  failedAt?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    userRole?: string[];
    pondokId?: number[];
    registrationDate?: {
      from?: string;
      to?: string;
    };
    lastActive?: {
      from?: string;
      to?: string;
    };
    location?: string[];
    customAttributes?: Record<string, any>;
  };
  estimatedSize: number;
  actualSize?: number;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  lastCalculated?: string;
}

export interface NotificationQueue {
  id: string;
  name: string;
  priority: number;
  maxRetries: number;
  retryDelay: number; // in seconds
  rateLimit: {
    maxPerSecond: number;
    maxPerMinute: number;
    maxPerHour: number;
  };
  channels: DeliveryChannel[];
  isActive: boolean;
}

// Webhook types for external integrations
export interface NotificationWebhook {
  id: string;
  name: string;
  url: string;
  events: NotificationEvent[];
  secret?: string;
  isActive: boolean;
  lastTriggered?: string;
  successCount: number;
  failureCount: number;
  createdAt: string;
  createdBy: string;
}

export type NotificationEvent =
  | "notification.created"
  | "notification.sent"
  | "notification.delivered"
  | "notification.opened"
  | "notification.clicked"
  | "notification.failed"
  | "campaign.started"
  | "campaign.completed";