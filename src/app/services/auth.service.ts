import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  SimpleRegisterRequest
} from '../models/user.model';
import { ApiResponse } from '../models/common.model';
import { UserData, LoginResponse } from './home.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly API_URL = environment.apiUrl;
  private readonly STORAGE_KEY = 'auth_data';
  private readonly TOKEN_KEY = 'sanctum_token';

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) {
    this.initStorage();
    this.loadStoredAuthData();
  }

  private async initStorage(): Promise<void> {
    try {
      if (this.storage && this.storage.create) {
        await this.storage.create();
        console.log('[Storage] Storage initialized successfully');
        const driver = (this.storage as any).driver;
        console.log('[Storage] Active storage driver:', driver);
      } else {
        console.warn('[Storage] Storage not available, using localStorage only');
      }
    } catch (error) {
      console.error('[Storage] Failed to initialize storage:', error);
      console.warn('[Storage] Fallback to localStorage only');
    }
  }
  

  // REST API Authentication Methods
  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        map(response => {
          console.log('Login response:', response);
          console.log('Token received:', response?.token);
          console.log('User received:', response?.user);
          
          if (response && response.token && response.user) {
            console.log('Login validation passed, processing authentication...');
            this.handleSuccessfulAuth(response);
            return response;
          }
          console.error('Login validation failed:', { hasResponse: !!response, hasToken: !!response?.token, hasUser: !!response?.user });
          throw new Error('Login failed - invalid response');
        })
      );
  }

  register(userData: SimpleRegisterRequest): Observable<any> {
    return this.http.post<{ message: string }>(`${this.API_URL}/register`, userData)
      .pipe(
        map(response => {
          if (response && response.message) {
            // Registration successful, but no token returned
            return {
              user: null,
              token: '',
              message: response.message
            };
          }
          throw new Error('Registration failed');
        })
      );
  }

  resetPassword(email: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/forgot-password`, { email })
      .pipe(
        map(response => {
          if (response.success) {
            return;
          }
          throw new Error(response.message || 'Password reset failed');
        })
      );
  }

  // Token Management - Simplified for Laravel Sanctum
  async getToken(): Promise<string | null> {
    console.log('Getting token...');
    
    // Coba dari localStorage
    const localToken = localStorage.getItem(this.TOKEN_KEY);
    if (localToken) {
      console.log('Token retrieved from localStorage:', localToken);
      return localToken;
    }
    
    // Kalau tidak ada, coba dari Ionic Storage (jika tersedia)
    try {
      // Pastikan storage sudah diinisialisasi
      if (this.storage) {
        const storedToken = await this.storage.get(this.TOKEN_KEY);
        if (storedToken) {
          console.log('Token retrieved from Ionic Storage:', storedToken);
          localStorage.setItem(this.TOKEN_KEY, storedToken); // cache ulang
          return storedToken;
        }
      } else {
        console.log('Ionic Storage not available, using localStorage only');
      }
    } catch (error) {
      console.error('Error retrieving token from Ionic Storage:', error);
      console.log('Falling back to localStorage only');
    }
    
    console.warn('Token not found');
    return null;
  }
  

  setToken(token: string): void {
    console.log('Setting token:', token ? 'Token exists' : 'No token');
    console.log('Token length:', token ? token.length : 0);
    
    // Store in localStorage (always available)
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('Token saved to localStorage');
    
    // Also save to Ionic Storage (if available)
    if (this.storage) {
      this.storage.set(this.TOKEN_KEY, token).then(() => {
        console.log('Token saved to Ionic Storage successfully');
      }).catch(error => {
        console.error('Error saving token to Ionic Storage:', error);
        console.log('Token saved to localStorage only');
      });
    } else {
      console.log('Ionic Storage not available, token saved to localStorage only');
    }
    
    console.log('Token storage process completed');
  }
  

  // Remove refresh token logic since Laravel Sanctum doesn't use it
  // Instead, we'll handle token expiration by redirecting to login

  // Logout
  async logout(): Promise<void> {
    try {
      // Call Laravel Sanctum logout endpoint if available
      const token = await this.getToken();
      if (token) {
        await firstValueFrom(this.http.post(`${this.API_URL}/auth/logout`, {}));
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear stored data regardless of API call success
      this.clearStoredAuthData();
      this.router.navigate(['/login']);
    }
  }

  // User Profile Management
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateProfile(profileData: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/profile`, profileData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Profile update failed');
        })
      );
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    const hasUser = this.currentUserSubject.value !== null;
    return !!(token && hasUser);
  }
  

  // Get CSRF token from Laravel Sanctum
  getCsrfToken(): Observable<void> {
    // Skip CSRF token if URL is null (disabled for development)
    if (!environment.csrfTokenUrl) {
      console.log('CSRF token fetching disabled for development');
      return new Observable(observer => {
        observer.next();
        observer.complete();
      });
    }
    
    return this.http.get(environment.csrfTokenUrl, { withCredentials: true })
      .pipe(
        map(() => {
          // CSRF token is automatically set in cookies by Laravel Sanctum
          console.log('CSRF token obtained');
        })
      );
  }

  // Auto-login if token exists - Fixed for Laravel Sanctum
  async autoLogin(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      try {
        console.log('Attempting auto-login with token');
        const response = await firstValueFrom(this.http.get<any>(`${this.API_URL}/user`));
        if (response && response.id) {
          // Convert UserData to User format
          const user: User = {
            id: response.id,
            name: response.nama,
            email: response.email,
            isActive: true,
            createdAt: new Date(response.created_at),
            updatedAt: new Date(response.updated_at)
          };
          
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          console.log('Auto-login successful');
        } else {
          console.log('Auto-login failed - invalid user data');
          this.clearStoredAuthData();
        }
      } catch (error) {
        console.error('Auto-login failed:', error);
        this.clearStoredAuthData();
      }
    } else {
      console.log('No token found for auto-login');
    }
  }

  // Private Helper Methods
  private handleSuccessfulAuth(authResponse: any): void {
    console.log('Handling successful authentication');
    
    // Convert UserData to User format for compatibility
    const user: User = {
      id: authResponse.user.id,
      name: authResponse.user.nama,
      email: authResponse.user.email,
      isActive: true, // Assume active after login
      createdAt: new Date(authResponse.user.created_at),
      updatedAt: new Date(authResponse.user.updated_at)
    };
    
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.setToken(authResponse.token);
    this.storeAuthData(user, authResponse.token);
    
    // Also store user data in 'userData' key for consistency with other parts of the app
    this.storage.set('userData', {
      id: authResponse.user.id,
      name: authResponse.user.nama,
      email: authResponse.user.email,
      phone: authResponse.user.no_telepon || '',
      joinDate: new Date(authResponse.user.created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });
  }

  private async storeAuthData(user: User, token: string): Promise<void> {
    console.log('Storing auth data in Ionic Storage...');
    try {
      if (this.storage) {
        await this.storage.set(this.STORAGE_KEY, { user, token });
        console.log('Auth data stored successfully in Ionic Storage');
      } else {
        console.log('Ionic Storage not available, auth data stored in localStorage only');
        // Store user data in localStorage as fallback
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error storing auth data in Ionic Storage:', error);
      console.log('Falling back to localStorage only');
      // Store user data in localStorage as fallback
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }

  private async loadStoredAuthData(): Promise<void> {
    console.log('Loading stored auth data...');
    try {
      if (this.storage) {
        const authData = await this.storage.get(this.STORAGE_KEY);
        console.log('Auth data from Ionic Storage:', authData);
        
        if (authData?.user && authData?.token) {
          console.log('Valid auth data found in Ionic Storage, restoring session...');
          this.currentUserSubject.next(authData.user);
          this.isAuthenticatedSubject.next(true);
          this.setToken(authData.token);
          console.log('Stored auth data loaded successfully from Ionic Storage');
          return;
        }
      }
      
      // Fallback to localStorage
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userData = localStorage.getItem('auth_user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          console.log('Valid auth data found in localStorage, restoring session...');
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          console.log('Stored auth data loaded successfully from localStorage');
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      } else {
        console.log('No valid auth data found in any storage');
      }
    } catch (error) {
      console.error('Error loading stored auth data:', error);
    }
  }

  private clearStoredAuthData(): void {
    console.log('Clearing stored auth data...');
    
    // Clear localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Clear all localStorage items that might contain user data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear Ionic Storage (if available)
    if (this.storage) {
      this.storage.remove(this.STORAGE_KEY);
      this.storage.remove(this.TOKEN_KEY);
      this.storage.remove('userData');
    }
    
    // Clear sessionStorage as well
    sessionStorage.clear();
    
    // Reset BehaviorSubjects
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    console.log('All stored data cleared successfully');
  }

  // Method to clear service caches (called from components)
  clearServiceCaches(): void {
    // This method can be called from components that have access to other services
    // to clear their caches during logout
    console.log('Service caches should be cleared by individual components');
  }

  async initializeAuth(): Promise<void> {
    console.log('Initializing authentication...');
    try {
      // Try to initialize Ionic Storage
      if (this.storage) {
        await this.storage.create();
        console.log('Ionic Storage created successfully');
      } else {
        console.log('Ionic Storage not available, using localStorage only');
      }
      
      await this.loadStoredAuthData();
      console.log('Authentication initialization completed');
    } catch (error) {
      console.error('Error initializing authentication:', error);
      console.log('Falling back to localStorage only');
      // Try to load from localStorage even if Ionic Storage fails
      await this.loadStoredAuthData();
    }
  }
} 