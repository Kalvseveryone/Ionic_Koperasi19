export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  ktpNumber?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  ktpNumber: string;
  address: string;
  birthDate: Date;
  gender: 'male' | 'female';
  occupation: string;
  monthlyIncome: number;
  profileImage?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  ktpNumber: string;
  address: string;
  birthDate: Date;
  gender: 'male' | 'female';
  occupation: string;
  monthlyIncome: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  role?: string;
}

// Simple register request for Laravel API
export interface SimpleRegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
} 