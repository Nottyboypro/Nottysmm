

export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  PARTIAL = 'Partial',
  PROCESSING = 'Processing',
  FAILED = 'Failed'
}

export interface SMMService {
  service: number;
  name: string;
  rate: string;
  min: string;
  max: string;
  category: string;
  type: string;
  description: string;
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
  providerId?: string; // Which provider this belongs to
  originalRate?: string; // Base rate from provider
  pinned?: boolean;
  enabled?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  balance: number;
  currency: string;
  status: 'Active' | 'Inactive';
  priority: number;
}

export interface Order {
  id: string;
  userId?: string;
  username?: string;
  serviceId: number;
  serviceName: string;
  link: string;
  quantity: number;
  charge: number;
  profit?: number;
  providerSpending?: number;
  status: OrderStatus;
  start_count?: string;
  remains?: string;
  createdAt: string;
  timestamp?: number;
  canRefill: boolean;
  refillStatus?: 'None' | 'Requested' | 'Processing' | 'Completed' | 'Rejected';
  providerOrderId?: string;
  providerId?: string;
  error?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  currency: string;
  isAdmin: boolean;
  apiKey?: string;
  status?: 'active' | 'banned';
  totalSpent?: number;
  profitContribution?: number;
  lastLogin?: string;
  group?: 'Standard' | 'VIP' | 'Reseller';
}

export interface Coupon {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed';
  value: number;
  usageLimit: number;
  usedCount: number;
  expiry: string;
  status: 'Active' | 'Expired';
}

export interface SystemLog {
  id: string;
  type: 'API' | 'SECURITY' | 'CRON' | 'WALLET' | 'ADMIN';
  message: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Critical';
  time: string;
  timestamp: number;
}

export interface Ticket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  orderId?: string;
  status: 'Open' | 'Answered' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  lastUpdate: string;
  createdAt?: number;
  messages: { role: 'user' | 'admin'; text: string; time: string }[];
}

export interface PanelConfig {
  name: string;
  logo: string;
  favicon: string;
  banner: string;
  bannerEnabled: boolean;
  globalMarkup: number;
  terms: string;
  privacy: string;
}

// Added missing ActivityLog interface to fix compilation error in UserProfile.tsx
export interface ActivityLog {
  id: string;
  event: string;
  ip: string;
  time: string;
}