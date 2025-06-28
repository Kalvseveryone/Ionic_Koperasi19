export interface Simpanan {
  id: string;
  userId: string;
  type: 'pokok' | 'wajib' | 'sukarela';
  amount: number;
  balance: number;
  status: 'active' | 'inactive' | 'frozen';
  createdAt: Date;
  updatedAt: Date;
}

export interface SimpananPokok {
  id: string;
  userId: string;
  amount: number;
  paidAt: Date;
  status: 'paid' | 'unpaid';
}

export interface SimpananWajib {
  id: string;
  userId: string;
  monthlyAmount: number;
  totalAmount: number;
  lastPaymentDate: Date;
  nextDueDate: Date;
  status: 'current' | 'overdue' | 'paid';
}

export interface SimpananSukarela {
  id: string;
  userId: string;
  balance: number;
  lastTransactionDate: Date;
  status: 'active' | 'inactive';
}

export interface SimpananTransaction {
  id: string;
  simpananId: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  transactionDate: Date;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  referenceNumber: string;
}

export interface SimpananSummary {
  totalSimpanan: number;
  simpananPokok: number;
  simpananWajib: number;
  simpananSukarela: number;
  lastUpdated: Date;
}

export interface CreateSimpananRequest {
  type: 'pokok' | 'wajib' | 'sukarela';
  amount: number;
  description?: string;
}

export interface SimpananTransactionRequest {
  simpananId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
} 