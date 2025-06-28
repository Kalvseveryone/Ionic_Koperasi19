import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  Simpanan, 
  SimpananPokok, 
  SimpananWajib, 
  SimpananSukarela,
  SimpananTransaction,
  SimpananSummary,
  CreateSimpananRequest,
  SimpananTransactionRequest
} from '../models/simpanan.model';
import { ApiResponse, PaginatedResponse } from '../models/common.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SimpananService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get simpanan for current user (anggota)
  getSimpananList(): Observable<Simpanan[]> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.get<Simpanan[]>(`${this.API_URL}/anggota/${anggotaId}/simpanan`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch simpanan list');
        })
      );
  }

  // Get simpanan summary for current user
  getSimpananSummary(): Observable<SimpananSummary> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.get<SimpananSummary>(`${this.API_URL}/anggota/${anggotaId}/simpanan`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch simpanan summary');
        })
      );
  }

  // Get specific simpanan by type for current user
  getSimpananByType(type: 'pokok' | 'wajib' | 'sukarela'): Observable<Simpanan> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.get<Simpanan>(`${this.API_URL}/anggota/${anggotaId}/simpanan/${type}`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch simpanan');
        })
      );
  }

  // Create new simpanan for current user
  createSimpanan(request: CreateSimpananRequest): Observable<Simpanan> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.post<Simpanan>(`${this.API_URL}/anggota/${anggotaId}/simpanan`, request)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to create simpanan');
        })
      );
  }

  // Get simpanan transactions for current user
  getSimpananTransactions(
    simpananId?: string, 
    page: number = 1, 
    limit: number = 10
  ): Observable<PaginatedResponse<SimpananTransaction>> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (simpananId) {
      params = params.set('simpananId', simpananId);
    }

    return this.http.get<PaginatedResponse<SimpananTransaction>>(
      `${this.API_URL}/anggota/${anggotaId}/simpanan/transactions`, 
      { params }
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to fetch transactions');
      })
    );
  }

  // Create simpanan transaction (deposit/withdrawal) for current user
  createTransaction(request: SimpananTransactionRequest): Observable<SimpananTransaction> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.post<SimpananTransaction>(
      `${this.API_URL}/anggota/${anggotaId}/simpanan/transactions`, 
      request
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to create transaction');
      })
    );
  }

  // Pay simpanan wajib for current user
  paySimpananWajib(amount: number): Observable<SimpananTransaction> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.post<SimpananTransaction>(
      `${this.API_URL}/anggota/${anggotaId}/simpanan/wajib/pay`, 
      { amount }
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to pay simpanan wajib');
      })
    );
  }

  // Add simpanan sukarela for current user
  addSimpananSukarela(amount: number, description?: string): Observable<SimpananTransaction> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.post<SimpananTransaction>(
      `${this.API_URL}/anggota/${anggotaId}/simpanan/sukarela/deposit`, 
      { amount, description }
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to add simpanan sukarela');
      })
    );
  }

  // Withdraw simpanan sukarela for current user
  withdrawSimpananSukarela(amount: number, description?: string): Observable<SimpananTransaction> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.post<SimpananTransaction>(
      `${this.API_URL}/anggota/${anggotaId}/simpanan/sukarela/withdraw`, 
      { amount, description }
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to withdraw simpanan sukarela');
      })
    );
  }

  // Get transaction by ID for current user
  getTransactionById(transactionId: string): Observable<SimpananTransaction> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.get<SimpananTransaction>(
      `${this.API_URL}/anggota/${anggotaId}/simpanan/transactions/${transactionId}`
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to fetch transaction');
      })
    );
  }

  // Cancel transaction for current user
  cancelTransaction(transactionId: string, reason?: string): Observable<SimpananTransaction> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.put<SimpananTransaction>(
      `${this.API_URL}/anggota/${anggotaId}/simpanan/transactions/${transactionId}/cancel`, 
      { reason }
    ).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Failed to cancel transaction');
      })
    );
  }

  // Get simpanan wajib due date info for current user
  getSimpananWajibInfo(): Observable<SimpananWajib> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.get<SimpananWajib>(`${this.API_URL}/anggota/${anggotaId}/simpanan/wajib/info`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch simpanan wajib info');
        })
      );
  }

  // Get simpanan sukarela info for current user
  getSimpananSukarelaInfo(): Observable<SimpananSukarela> {
    const currentUser = this.authService.getCurrentUser();
    const anggotaId = currentUser?.id;
    
    if (!anggotaId) {
      throw new Error('User not authenticated');
    }

    return this.http.get<SimpananSukarela>(`${this.API_URL}/anggota/${anggotaId}/simpanan/sukarela/info`)
      .pipe(
        map(response => {
          if (response) {
            return response;
          }
          throw new Error('Failed to fetch simpanan sukarela info');
        })
      );
  }

  // Clear any cached data (called during logout)
  clearCache(): void {
    // This service doesn't cache data, but this method can be called
    // during logout to ensure any potential future caching is cleared
    console.log('Simpanan service cache cleared');
  }
} 