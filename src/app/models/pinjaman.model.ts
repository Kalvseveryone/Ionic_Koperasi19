export interface Pinjaman {
  id: string;
  userId: string;
  type: 'konsumtif' | 'produktif' | 'emergency';
  amount: number;
  interestRate: number;
  term: number; // in months
  monthlyPayment: number;
  totalPayment: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted';
  purpose: string;
  collateral?: string;
  guarantor?: string;
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PinjamanApplication {
  id: string;
  userId: string;
  type: 'konsumtif' | 'produktif' | 'emergency';
  amount: number;
  term: number;
  purpose: string;
  monthlyIncome: number;
  collateral?: string;
  guarantor?: string;
  documents: string[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PinjamanPayment {
  id: string;
  pinjamanId: string;
  userId: string;
  amount: number;
  paymentDate: Date;
  dueDate: Date;
  status: 'pending' | 'completed' | 'late' | 'partial';
  paymentMethod: 'cash' | 'transfer' | 'automatic';
  referenceNumber: string;
  notes?: string;
}

export interface PinjamanSummary {
  totalPinjaman: number;
  activePinjaman: number;
  totalPaid: number;
  totalRemaining: number;
  nextPaymentDate?: Date;
  nextPaymentAmount: number;
  overdueAmount: number;
  lastUpdated: Date;
}

export interface CreatePinjamanRequest {
  type: 'konsumtif' | 'produktif' | 'emergency';
  amount: number;
  term: number;
  purpose: string;
  monthlyIncome: number;
  collateral?: string;
  guarantor?: string;
  documents?: string[];
}

export interface PinjamanPaymentRequest {
  pinjamanId: string;
  amount: number;
  paymentMethod: 'cash' | 'transfer' | 'automatic';
  notes?: string;
} 