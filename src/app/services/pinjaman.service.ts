import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  Pinjaman, 
  PinjamanApplication, 
  PinjamanPayment,
  PinjamanSummary,
  CreatePinjamanRequest,
  PinjamanPaymentRequest
} from '../models/pinjaman.model';
import { ApiResponse, PaginatedResponse } from '../models/common.model';
import { AuthService } from './auth.service';

// Interface untuk request ajukan pinjaman sesuai Laravel backend
export interface AjukanPinjamanRequest {
  jumlah: number;
  jangka_waktu: number;
  tujuan: string;
}

// Interface untuk response ajukan pinjaman
export interface AjukanPinjamanResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    anggota_id: string;
    jumlah: number;
    jangka_waktu: number;
    tujuan: string;
    status: 'pending' | 'disetujui' | 'ditolak' | 'aktif';
    catatan?: string;
    tanggal_pinjam: string;
    created_at: string;
    updated_at: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PinjamanService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Method khusus untuk ajukan pinjaman sesuai Laravel backend
  ajukanPinjaman(request: AjukanPinjamanRequest): Observable<AjukanPinjamanResponse> {
    console.log('Submitting pinjaman application:', request);
    
    return this.http.post<AjukanPinjamanResponse>(`${this.API_URL}/pinjaman`, request, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).pipe(
      map(response => {
        console.log('Pinjaman application response:', response);
        return response;
      })
    );
  }

  // Get all pinjaman for current user
  getPinjamanList(): Observable<Pinjaman[]> {
    return this.http.get<any>(`${this.API_URL}/pinjaman`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response?.message || 'Failed to fetch pinjaman list');
        })
      );
  }

  // Get pinjaman summary for current user
  getPinjamanSummary(): Observable<PinjamanSummary> {
    return this.http.get<PinjamanSummary>(`${this.API_URL}/pinjaman/summary`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch pinjaman summary');
        })
      );
  }

  // Get specific pinjaman by ID
  getPinjamanById(pinjamanId: string): Observable<Pinjaman> {
    return this.http.get<Pinjaman>(`${this.API_URL}/pinjaman/${pinjamanId}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch pinjaman');
        })
      );
  }

  // Create new pinjaman application
  createPinjamanApplication(request: CreatePinjamanRequest): Observable<PinjamanApplication> {
    return this.http.post<PinjamanApplication>(`${this.API_URL}/pinjaman`, request)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to create pinjaman application');
        })
      );
  }

  // Get pinjaman applications for current user
  getPinjamanApplications(
    page: number = 1, 
    limit: number = 10
  ): Observable<PaginatedResponse<PinjamanApplication>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<PinjamanApplication>>(
      `${this.API_URL}/pinjaman/applications`, 
      { params }
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to fetch pinjaman applications');
      })
    );
  }

  // Make pinjaman payment
  makePayment(request: PinjamanPaymentRequest): Observable<PinjamanPayment> {
    return this.http.post<PinjamanPayment>(`${this.API_URL}/pinjaman/payments`, request)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to make payment');
        })
      );
  }

  // Get pinjaman calculator
  getPinjamanCalculator(
    amount: number, 
    duration: number, 
    interestRate: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('amount', amount.toString())
      .set('duration', duration.toString())
      .set('interestRate', interestRate.toString());

    return this.http.get<any>(`${this.API_URL}/pinjaman/calculator`, { params })
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to calculate pinjaman');
        })
      );
  }

  // Get pinjaman terms and conditions
  getPinjamanTerms(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/pinjaman/terms`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch pinjaman terms');
        })
      );
  }

  // Get pinjaman application by ID
  getPinjamanApplicationById(applicationId: string): Observable<PinjamanApplication> {
    return this.http.get<PinjamanApplication>(`${this.API_URL}/pinjaman/applications/${applicationId}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch pinjaman application');
        })
      );
  }

  // Cancel pinjaman application
  cancelPinjamanApplication(applicationId: string, reason?: string): Observable<PinjamanApplication> {
    return this.http.put<PinjamanApplication>(
      `${this.API_URL}/pinjaman/applications/${applicationId}/cancel`, 
      { reason }
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to cancel pinjaman application');
      })
    );
  }

  // Get pinjaman payments for specific pinjaman
  getPinjamanPayments(
    pinjamanId: string, 
    page: number = 1, 
    limit: number = 10
  ): Observable<PaginatedResponse<PinjamanPayment>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<PinjamanPayment>>(
      `${this.API_URL}/pinjaman/${pinjamanId}/payments`, 
      { params }
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to fetch pinjaman payments');
      })
    );
  }

  // Get payment by ID
  getPaymentById(paymentId: string): Observable<PinjamanPayment> {
    return this.http.get<PinjamanPayment>(`${this.API_URL}/pinjaman/payments/${paymentId}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch payment');
        })
      );
  }

  // Clear service cache
  clearCache(): void {
    console.log('Clearing pinjaman service cache');
  }
} 