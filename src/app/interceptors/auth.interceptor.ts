import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Gunakan from() karena getToken() sekarang async
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        if (token) {
          request = this.addToken(request, token);
        }

        // Lanjutkan request setelah token ditambahkan (jika ada)
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 419) {
              return this.handleAuthError(request, next);
            }
            return throwError(() => error);
          })
        );
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  private handleAuthError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Authentication error detected, logging out user');

    // Sanctum tidak punya refresh token, logout saja
    this.authService.logout();
    this.router.navigate(['/login']);

    return throwError(() => new Error('Authentication failed'));
  }
}
