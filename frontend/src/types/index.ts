export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

export interface UserProfile {
  id: string;
  fullName: string;
  email?: string;
  emailVerified?: boolean;
  roles: UserRole[];
  preferredLocales: string[];
  reputation: number;
  interestTags: string[];
}

export interface ListingSummary {
  id: string;
  title: string;
  price: number;
  currency: string;
  thumbnailUrl: string;
  sellerId: string;
  status: 'PENDING_REVIEW' | 'PUBLISHED' | 'PAUSED' | 'SOLD';
}

export interface NotificationPreference {
  id: string;
  channel: 'IN_APP' | 'EMAIL';
  trigger: 'NEW_LISTING' | 'PRICE_CHANGE' | 'FOLLOWED_SELLER';
  enabled: boolean;
}

export interface ChatThread {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  lastMessagePreview: string;
  unreadCount: number;
  updatedAt: string;
}

export interface FraudAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  listingId?: string;
  sellerId?: string;
  message: string;
  createdAt: string;
}




