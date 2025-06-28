import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Kolektor {
  id: number;
  nama: string;
  email: string;
  anggota_id: number;
  created_at: string;
  updated_at: string;
  anggota?: any;
  anggota_binaan?: any[];
}

export interface PaymentRecord {
  id: number;
  kolektor_id: number;
  anggota_id: number;
  pinjaman_id: number;
  amount: number;
  payment_date: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: number;
  anggota_id: number;
  pinjaman_id: number;
  amount: number;
  payment_date: string;
  status: string;
  kolektor_name: string;
  created_at: string;
}

export interface PaymentForm {
  anggota_id: number;
  pinjaman_id: number;
  amount: number;
  payment_date: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class KolektorService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get kolektor profile
  getKolektorProfile(): Observable<Kolektor> {
    const currentUser = this.authService.getCurrentUser();
    const kolektorId = currentUser?.id;
    
    if (!kolektorId) {
      throw new Error('User not authenticated');
    }

    return this.http.get<Kolektor>(`${this.API_URL}/kolektor/${kolektorId}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch kolektor profile');
        })
      );
  }

  // Record payment (create payment record)
  recordPayment(paymentData: PaymentForm): Observable<PaymentRecord> {
    return this.http.post<PaymentRecord>(`${this.API_URL}/kolektor/payment`, paymentData)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to record payment');
        })
      );
  }

  // Submit payment for verification
  submitPayment(paymentId: number): Observable<PaymentRecord> {
    return this.http.post<PaymentRecord>(`${this.API_URL}/kolektor/payment/submit`, { payment_id: paymentId })
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to submit payment');
        })
      );
  }

  // Get payment history for specific anggota
  getPaymentHistory(anggotaId: number): Observable<PaymentHistory[]> {
    return this.http.get<PaymentHistory[]>(`${this.API_URL}/kolektor/payment/history/${anggotaId}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch payment history');
        })
      );
  }

  // Get payment form for specific anggota
  getPaymentForm(anggotaId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/kolektor/payment/form/${anggotaId}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch payment form');
        })
      );
  }

  // Get pending payments for kolektor
  getPendingPayments(): Observable<PaymentRecord[]> {
    return this.http.get<PaymentRecord[]>(`${this.API_URL}/admin/payments/pending`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch pending payments');
        })
      );
  }

  // Show payment verification form (for admin)
  showPaymentVerification(paymentId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/admin/payments/verify/${paymentId}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch payment verification form');
        })
      );
  }

  // Verify payment (for admin)
  verifyPayment(paymentId: number, verificationData: { status: 'verified' | 'rejected', notes?: string }): Observable<PaymentRecord> {
    return this.http.post<PaymentRecord>(`${this.API_URL}/admin/payments/${paymentId}/verify`, verificationData)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to verify payment');
        })
      );
  }

  // Get all payment history (for admin)
  getAllPaymentHistory(): Observable<PaymentHistory[]> {
    return this.http.get<PaymentHistory[]>(`${this.API_URL}/admin/payments/history`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch payment history');
        })
      );
  }
} 