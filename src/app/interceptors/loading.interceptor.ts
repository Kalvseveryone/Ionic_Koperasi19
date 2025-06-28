import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private activeRequests = 0;
  private loadingElement: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip loading for certain requests
    if (this.shouldSkipLoading(request.url)) {
      return next.handle(request);
    }

    this.activeRequests++;
    
    if (this.activeRequests === 1) {
      this.showLoading();
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.hideLoading();
        }
      })
    );
  }

  private shouldSkipLoading(url: string): boolean {
    // Skip loading for certain endpoints
    const skipEndpoints = [
      'auth/login',
      'auth/register',
      'auth/logout',
      'user/profile',
      'notifications'
    ];
    
    return skipEndpoints.some(endpoint => url.includes(endpoint));
  }

  private async showLoading() {
    if (!this.loadingElement) {
      this.loadingElement = await this.loadingController.create({
        message: 'Memuat data...',
        spinner: 'circles',
        translucent: true,
        backdropDismiss: false
      });
      await this.loadingElement.present();
    }
  }

  private async hideLoading() {
    if (this.loadingElement) {
      await this.loadingElement.dismiss();
      this.loadingElement = null;
    }
  }
} 