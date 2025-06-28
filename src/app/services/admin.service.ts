import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface AdminDashboard {
  totalAnggota: number;
  totalKolektor: number;
  totalPinjaman: number;
  totalSimpanan: number;
  recentTransactions: any[];
  pendingPayments: number;
}

export interface Anggota {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Kolektor {
  id: number;
  nama: string;
  email: string;
  anggota_id: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface LaporanKeuangan {
  periode: string;
  totalPendapatan: number;
  totalPengeluaran: number;
  saldo: number;
  details: any[];
}

export interface RekapHarian {
  tanggal: string;
  totalTransaksi: number;
  totalPendapatan: number;
  totalPengeluaran: number;
  details: any[];
}

export interface PendingPayment {
  id: number;
  kolektor_id: number;
  anggota_id: number;
  pinjaman_id: number;
  amount: number;
  payment_date: string;
  status: 'pending';
  notes?: string;
  kolektor_name: string;
  anggota_name: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get admin dashboard data
  getDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.API_URL}/admin/dashboard`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch dashboard data');
        })
      );
  }

  // Get anggota management data
  getManajemenAnggota(): Observable<Anggota[]> {
    return this.http.get<Anggota[]>(`${this.API_URL}/admin/anggota`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch anggota data');
        })
      );
  }

  // Get kolektor management data
  getManajemenKolektor(): Observable<Kolektor[]> {
    return this.http.get<Kolektor[]>(`${this.API_URL}/admin/kolektor`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch kolektor data');
        })
      );
  }

  // Get laporan keuangan
  getLaporanKeuangan(): Observable<LaporanKeuangan> {
    return this.http.get<LaporanKeuangan>(`${this.API_URL}/admin/laporan-keuangan`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch laporan keuangan');
        })
      );
  }

  // Get rekap harian
  getRekapHarian(): Observable<RekapHarian[]> {
    return this.http.get<RekapHarian[]>(`${this.API_URL}/admin/rekap-harian`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch rekap harian');
        })
      );
  }

  // Get pending payments
  getPendingPayments(): Observable<PendingPayment[]> {
    return this.http.get<PendingPayment[]>(`${this.API_URL}/admin/payments/pending`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch pending payments');
        })
      );
  }

  // Show payment verification form
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

  // Verify payment
  verifyPayment(paymentId: number, verificationData: { status: 'verified' | 'rejected', notes?: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/admin/payments/${paymentId}/verify`, verificationData)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to verify payment');
        })
      );
  }

  // Get payment history
  getPaymentHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/admin/payments/history`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch payment history');
        })
      );
  }

  // Create new anggota
  createAnggota(anggotaData: Partial<Anggota>): Observable<Anggota> {
    return this.http.post<Anggota>(`${this.API_URL}/anggota`, anggotaData)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to create anggota');
        })
      );
  }

  // Update anggota
  updateAnggota(anggotaId: number, anggotaData: Partial<Anggota>): Observable<Anggota> {
    return this.http.put<Anggota>(`${this.API_URL}/anggota/${anggotaId}`, anggotaData)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to update anggota');
        })
      );
  }

  // Delete anggota
  deleteAnggota(anggotaId: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/anggota/${anggotaId}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to delete anggota');
        })
      );
  }

  // Create new kolektor
  createKolektor(kolektorData: Partial<Kolektor>): Observable<Kolektor> {
    return this.http.post<Kolektor>(`${this.API_URL}/kolektor`, kolektorData)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to create kolektor');
        })
      );
  }

  // Update kolektor
  updateKolektor(kolektorId: number, kolektorData: Partial<Kolektor>): Observable<Kolektor> {
    return this.http.put<Kolektor>(`${this.API_URL}/kolektor/${kolektorId}`, kolektorData)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to update kolektor');
        })
      );
  }

  // Delete kolektor
  deleteKolektor(kolektorId: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/kolektor/${kolektorId}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to delete kolektor');
        })
      );
  }

  // Export laporan keuangan
  exportLaporanKeuangan(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/laporan-keuangan/export`, { responseType: 'blob' })
      .pipe(
        map(response => {
          if (response) {
            return response as Blob;
          }
          throw new Error('Failed to export laporan keuangan');
        })
      );
  }
} 