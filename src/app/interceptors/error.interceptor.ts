import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Terjadi kesalahan yang tidak diketahui';
        let shouldRedirect = false;

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Permintaan tidak valid';
              break;
            case 401:
              errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
              shouldRedirect = true;
              break;
            case 403:
              errorMessage = 'Anda tidak memiliki akses ke fitur ini.';
              break;
            case 404:
              errorMessage = 'Data yang Anda cari tidak ditemukan.';
              break;
            case 409:
              errorMessage = error.error?.message || 'Data sudah ada dalam sistem.';
              break;
            case 419:
              errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
              shouldRedirect = true;
              break;
            case 422:
              // Handle validation errors from Laravel
              if (error.error?.errors) {
                const validationErrors = error.error.errors;
                const firstError = Object.values(validationErrors)[0];
                errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
              } else {
                errorMessage = error.error?.message || 'Data yang dimasukkan tidak valid.';
              }
              break;
            case 429:
              errorMessage = 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
              break;
            case 500:
              errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
              break;
            case 502:
              errorMessage = 'Server sedang tidak tersedia. Silakan coba lagi nanti.';
              break;
            case 503:
              errorMessage = 'Layanan sedang dalam pemeliharaan. Silakan coba lagi nanti.';
              break;
            default:
              errorMessage = error.error?.message || 'Terjadi kesalahan pada sistem.';
          }
        }

        // Show error toast in development mode
        if (!environment.production) {
          this.showErrorToast(errorMessage);
          console.error('API Error:', error);
        } else {
          // In production, only show user-friendly messages
          this.showErrorToast(errorMessage);
        }

        // Handle redirect for authentication errors
        if (shouldRedirect) {
          this.handleAuthError();
        }

        return throwError(() => error);
      })
    );
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      color: 'danger',
      buttons: [
        {
          text: 'Tutup',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  private async handleAuthError() {
    // Clear all authentication related data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Clear any other auth-related items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Show alert and redirect to login
    const alert = await this.alertController.create({
      header: 'Sesi Berakhir',
      message: 'Sesi Anda telah berakhir. Silakan login kembali.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }
} 