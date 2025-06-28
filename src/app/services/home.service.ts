import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaces based on actual Laravel API response
export interface UserData {
  id: string;
  kolektor_id: string;
  nama: string;
  email: string;
  alamat: string;
  no_telepon: string;
  nik: string;
  simpanan_pokok: string;
  simpanan_wajib: string;
  simpanan_sukarela: string;
  saldo_simpanan: string;
  total_pinjaman: string;
  total_denda: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  user: UserData;
  role: string;
  token: string;
}

export interface HomeData {
  user: UserData;
  simpanan: {
    total: number;
    pokok: number;
    wajib: number;
    sukarela: number;
  };
  pinjaman: {
    status: string;
    amount: number;
    dueDate: string;
    progress: number;
    totalPinjaman: number;
    sisaPinjaman: number;
  };
  recentTransactions: Transaction[];
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  title: string;
  date: string;
  amount: number | string;
  description?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  user?: T;
  role?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get user data from login response
  getUserData(): Observable<UserData> {
    return this.http.get<UserData>(`${this.API_URL}/user`)
      .pipe(
        map(response => {
          if (response && response.id) {
            return response;
          }
          throw new Error('Failed to fetch user data');
        })
      );
  }

  // Get home data (combine user data with additional info)
  getHomeData(): Observable<HomeData> {
    return this.getUserData().pipe(
      map(userData => {
        // Convert string amounts to numbers
        const simpananPokok = parseFloat(userData.simpanan_pokok) || 0;
        const simpananWajib = parseFloat(userData.simpanan_wajib) || 0;
        const simpananSukarela = parseFloat(userData.simpanan_sukarela) || 0;
        const totalSimpanan = parseFloat(userData.saldo_simpanan) || 0;
        const totalPinjaman = parseFloat(userData.total_pinjaman) || 0;
        const totalDenda = parseFloat(userData.total_denda) || 0;

        return {
          user: userData,
          simpanan: {
            total: totalSimpanan,
            pokok: simpananPokok,
            wajib: simpananWajib,
            sukarela: simpananSukarela
          },
          pinjaman: {
            status: totalPinjaman > 0 ? 'Aktif' : 'Tidak Ada',
            amount: totalPinjaman,
            dueDate: this.calculateDueDate(userData.created_at),
            progress: totalPinjaman > 0 ? 50 : 0, // Default progress
            totalPinjaman: totalPinjaman,
            sisaPinjaman: totalPinjaman
          },
          recentTransactions: this.generateSampleTransactions(userData)
        };
      })
    );
  }

  // Get simpanan summary
  getSimpananSummary(): Observable<any> {
    return this.getUserData().pipe(
      map(userData => ({
        total: parseFloat(userData.saldo_simpanan) || 0,
        pokok: parseFloat(userData.simpanan_pokok) || 0,
        wajib: parseFloat(userData.simpanan_wajib) || 0,
        sukarela: parseFloat(userData.simpanan_sukarela) || 0
      }))
    );
  }

  // Get pinjaman status
  getPinjamanStatus(): Observable<any> {
    return this.getUserData().pipe(
      map(userData => {
        const totalPinjaman = parseFloat(userData.total_pinjaman) || 0;
        const totalDenda = parseFloat(userData.total_denda) || 0;
        
        return {
          status: totalPinjaman > 0 ? 'Aktif' : 'Tidak Ada',
          amount: totalPinjaman,
          dueDate: this.calculateDueDate(userData.created_at),
          progress: totalPinjaman > 0 ? 50 : 0,
          totalPinjaman: totalPinjaman,
          sisaPinjaman: totalPinjaman,
          denda: totalDenda
        };
      })
    );
  }

  // Get recent transactions (for now, generate sample data)
  getRecentTransactions(limit: number = 5): Observable<Transaction[]> {
    return this.getUserData().pipe(
      map(userData => this.generateSampleTransactions(userData))
    );
  }

  // Helper method to generate sample transactions based on user data
  private generateSampleTransactions(userData: UserData): Transaction[] {
    const transactions: Transaction[] = [];
    
    // Add simpanan wajib transaction if exists
    if (parseFloat(userData.simpanan_wajib) > 0) {
      transactions.push({
        id: 1,
        type: 'income',
        title: 'Simpanan Wajib',
        date: this.formatDate(userData.updated_at),
        amount: this.formatCurrency(parseFloat(userData.simpanan_wajib))
      });
    }

    // Add pinjaman transaction if exists
    if (parseFloat(userData.total_pinjaman) > 0) {
      transactions.push({
        id: 2,
        type: 'expense',
        title: 'Pinjaman',
        date: this.formatDate(userData.created_at),
        amount: this.formatCurrency(parseFloat(userData.total_pinjaman))
      });
    }

    // Add denda transaction if exists
    if (parseFloat(userData.total_denda) > 0) {
      transactions.push({
        id: 3,
        type: 'expense',
        title: 'Denda',
        date: this.formatDate(userData.updated_at),
        amount: this.formatCurrency(parseFloat(userData.total_denda))
      });
    }

    return transactions.slice(0, 5); // Return max 5 transactions
  }

  // Calculate due date (sample calculation)
  private calculateDueDate(createdAt: string): string {
    const created = new Date(createdAt);
    const dueDate = new Date(created.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from creation
    return this.formatDate(dueDate.toISOString());
  }

  // Format currency helper
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Format date helper
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Clear any cached data (called during logout)
  clearCache(): void {
    // This service doesn't cache data, but this method can be called
    // during logout to ensure any potential future caching is cleared
    console.log('Home service cache cleared');
  }

  // Get transaction history
  getTransactionHistory(): Observable<Transaction[]> {
    return this.http.get<any>(`${this.API_URL}/transactions/history`).pipe(
      map(response => {
        if (response && response.success && response.data) {
          return response.data.map((item: any) => ({
            id: item.id,
            type: item.type === 'masuk' ? 'income' : 'expense',
            title: item.jenis_transaksi || item.title,
            date: this.formatDate(item.created_at || item.tanggal_transaksi),
            amount: this.formatCurrency(item.jumlah)
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching transaction history:', error);
        return of([]);
      })
    );
  }
} 