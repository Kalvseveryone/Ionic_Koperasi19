export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  title: string;
  amount: number;
  description?: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  referenceNumber: string;
  userId: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface AppSettings {
  maintenanceMode: boolean;
  appVersion: string;
  minAppVersion: string;
  features: {
    simpanan: boolean;
    pinjaman: boolean;
    notifications: boolean;
    biometrics: boolean;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
} 