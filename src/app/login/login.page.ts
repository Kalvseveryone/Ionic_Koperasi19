import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController, IonInput } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
  @ViewChild('emailInput', { static: false }) emailInput!: IonInput;

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  
  // Form validation errors
  emailError: string = '';
  passwordError: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Periksa apakah user sudah login dengan cara async
    const isAuth = await this.authService.isAuthenticated();
    if (isAuth) {
      this.router.navigate(['/home']);
    }
  }

  ngAfterViewInit() {
    // Auto focus input
    setTimeout(() => {
      if (this.emailInput) {
        this.emailInput.setFocus();
      }
    }, 400);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.email || !this.password) {
      await this.presentToast('Mohon isi email dan password Anda');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      await this.presentToast('Mohon masukkan email yang valid');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Sedang masuk...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      const response = await this.authService.login({
        email: this.email,
        password: this.password
      }).toPromise();

      await loading.dismiss();

      if (response && response.token) {
        // Berhasil login
        this.router.navigate(['/home']);
      } else {
        this.presentAlert('Login Gagal', 'Email atau password yang Anda masukkan salah.');
      }
    } catch (error: any) {
      await loading.dismiss();
      const errorMessage = error?.error?.message || 'Terjadi kesalahan saat login. Silakan coba lagi nanti.';
      this.presentAlert('Error', errorMessage);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  contactAdmin() {
    const phoneNumber = '6282123996315';
    const message = 'Halo Admin, saya ingin bertanya tentang lupa password.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Buka WhatsApp di browser atau aplikasi
    window.open(whatsappUrl, '_blank');
  }

  goToWelcome() {
    this.router.navigate(['/welcome']);
  }
}
