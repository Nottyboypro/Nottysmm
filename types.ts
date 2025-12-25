
export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  PARTIAL = 'Partial',
  PROCESSING = 'Processing'
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
  status: OrderStatus;
  start_count?: string;
  remains?: string;
  createdAt: string;
  canRefill: boolean;
  refillStatus?: 'None' | 'Requested' | 'Processing' | 'Completed' | 'Rejected';
  providerOrderId?: string;
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

export interface PaymentGateway {
  id: string;
  name: string;
  status: 'Active' | 'Disabled';
  fee: number;
  minDeposit: number;
}

export interface SystemLog {
  id: string;
  type: 'API' | 'SECURITY' | 'CRON' | 'WALLET';
  message: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Critical';
  time: string;
}

export interface Ticket {
  id: string;
  subject: string;
  orderId?: string;
  status: 'Open' | 'Answered' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  lastUpdate: string;
  messages: { role: 'user' | 'admin'; text: string; time: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'system' | 'wallet';
}

export interface ActivityLog {
  id: string;
  event: string;
  ip: string;
  time: string;
}
