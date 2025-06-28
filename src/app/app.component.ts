// app.component.ts
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapacitorApp } from '@capacitor/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private authService: AuthService, 
    private platform: Platform,
    private alertController: AlertController,
    private router: Router
  ) {
    this.platform.ready().then(() => {
      this.initializeApp();
    });
  }

  private async initializeApp() {
    try {
      console.log('[AppComponent] Initializing app...');

      // Show splash screen
      await SplashScreen.show({
        showDuration: 2000,
        autoHide: true,
      });

      // Set status bar style
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#14b8a6' });

      // Wajib inisialisasi storage terlebih dahulu
      await this.authService.initializeAuth();

      // Setelah storage siap, baru auto login
      await this.authService.autoLogin();

      // Handle hardware back button
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        this.handleBackButton(canGoBack);
      });

      // Hide splash screen after initialization
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);

      console.log('[AppComponent] App initialization completed');
    } catch (error) {
      console.error('[AppComponent] App initialization error:', error);
      // Hide splash screen even if there's an error
      SplashScreen.hide();
    }
  }

  private async handleBackButton(canGoBack: boolean) {
    const currentUrl = this.router.url;
    // Jika di halaman login atau home, keluar aplikasi
    if (currentUrl === '/login' || currentUrl === '/home') {
      const alert = await this.alertController.create({
        header: 'Keluar Aplikasi',
        message: 'Apakah Anda yakin ingin keluar dari aplikasi?',
        buttons: [
          {
            text: 'Batal',
            role: 'cancel'
          },
          {
            text: 'Keluar',
            handler: () => {
              CapacitorApp.exitApp();
            }
          }
        ]
      });
      await alert.present();
    } else if (canGoBack) {
      window.history.back();
    }
  }
}
