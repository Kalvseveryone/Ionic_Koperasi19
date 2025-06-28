import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { PinjamanService, AjukanPinjamanRequest } from '../services/pinjaman.service';

@Component({
  standalone: false,
  selector: 'app-ajukan',
  templateUrl: './ajukan.page.html',
  styleUrls: ['./ajukan.page.scss'],
})
export class AjukanPage implements OnInit {
  // Form data pinjaman sesuai struktur Laravel
  formPinjaman = {
    jumlah: 1000000, // Default amount
    jangka_waktu: 6, // Default to 6 months
    tujuan: '', // Tujuan pinjaman
    agreeToTerms: false
  };

  // Form state
  formSubmitted = false;
  isSubmitting = false;

  // Bunga per tahun
  bungaPerTahun = 12;

  // Available jangka waktu pinjaman (sesuai Laravel: 1-12 bulan)
  jangkaWaktuOptions = [
    { value: 1, label: '1 Bulan' },
    { value: 2, label: '2 Bulan' },
    { value: 3, label: '3 Bulan' },
    { value: 4, label: '4 Bulan' },
    { value: 5, label: '5 Bulan' },
    { value: 6, label: '6 Bulan' },
    { value: 7, label: '7 Bulan' },
    { value: 8, label: '8 Bulan' },
    { value: 9, label: '9 Bulan' },
    { value: 10, label: '10 Bulan' },
    { value: 11, label: '11 Bulan' },
    { value: 12, label: '12 Bulan' }
  ];

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private loadingController: LoadingController,
    private pinjamanService: PinjamanService
  ) { }

  ngOnInit() {
    // Initialize component
    console.log('AjukanPage initialized');
  }

  // Select jangka waktu pinjaman
  selectJangkaWaktu(jangkaWaktu: number) {
    this.formPinjaman.jangka_waktu = jangkaWaktu;
  }

  // Format amount with thousand separators
  formatAmount(amount: number): string {
    if (!amount) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Get the jangka waktu label
  getJangkaWaktuLabel(): string {
    const option = this.jangkaWaktuOptions.find(o => o.value === this.formPinjaman.jangka_waktu);
    return option ? option.label : '';
  }

  // Calculate monthly payment
  calculateMonthlyPayment(): string {
    if (!this.formPinjaman.jumlah || !this.formPinjaman.jangka_waktu) return '0';
    
    // Simple interest calculation
    const pokok = this.formPinjaman.jumlah;
    const bungaBulanan = this.bungaPerTahun / 100 / 12; // Monthly interest rate
    const jangkaWaktuBulan = this.formPinjaman.jangka_waktu;
    
    // Calculate monthly payment (principal + interest)
    const bungaTotal = pokok * bungaBulanan * jangkaWaktuBulan;
    const totalBayar = pokok + bungaTotal;
    const cicilanBulanan = totalBayar / jangkaWaktuBulan;
    
    return this.formatAmount(Math.round(cicilanBulanan));
  }

  // Calculate total payment
  calculateTotalPayment(): string {
    if (!this.formPinjaman.jumlah || !this.formPinjaman.jangka_waktu) return '0';
    
    const pokok = this.formPinjaman.jumlah;
    const bungaBulanan = this.bungaPerTahun / 100 / 12; // Monthly interest rate
    const jangkaWaktuBulan = this.formPinjaman.jangka_waktu;
    
    // Calculate total payment
    const totalBunga = pokok * bungaBulanan * jangkaWaktuBulan;
    const totalBayar = pokok + totalBunga;
    
    return this.formatAmount(Math.round(totalBayar));
  }

  // Validate form
  isFormValid(): boolean {
    return this.formPinjaman.jumlah >= 100000 &&
           this.formPinjaman.jumlah <= 10000000 &&
           this.formPinjaman.jangka_waktu > 0 &&
           this.formPinjaman.jangka_waktu <= 12 &&
           this.formPinjaman.tujuan.trim().length > 0 &&
           this.formPinjaman.agreeToTerms;
  }

  // Submit pinjaman application ke Laravel backend
  async submitPinjamanApplication() {
    if (!this.isFormValid()) {
      this.formSubmitted = true;
      this.showErrorAlert('Form tidak valid', 'Silakan lengkapi semua field yang diperlukan.');
      return;
    }

    this.isSubmitting = true;
    this.formSubmitted = true;

    // Show loading
    const loading = await this.loadingController.create({
      message: 'Mengirim pengajuan pinjaman...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      console.log('Submitting pinjaman application to backend...');
      
      // Prepare request sesuai struktur Laravel
      const request: AjukanPinjamanRequest = {
        jumlah: this.formPinjaman.jumlah,
        jangka_waktu: this.formPinjaman.jangka_waktu,
        tujuan: this.formPinjaman.tujuan.trim()
      };

      console.log('Request data:', request);

      // Submit ke backend
      this.pinjamanService.ajukanPinjaman(request).subscribe({
        next: (response) => {
          console.log('Backend response:', response);
          loading.dismiss();
          this.isSubmitting = false;
          
          if (response.success) {
            this.showSuccessAlert(
              'Pengajuan Berhasil', 
              'Pengajuan pinjaman Anda telah berhasil dikirim. Tim kami akan menghubungi Anda dalam 1-3 hari kerja.'
            );
            
            // Reset form
            this.resetForm();
            
            // Navigate to pinjaman list
            setTimeout(() => {
              this.router.navigate(['/pinjaman']);
            }, 2000);
          } else {
            this.showErrorAlert('Pengajuan Gagal', response.message || 'Terjadi kesalahan saat mengirim pengajuan.');
          }
        },
        error: (error) => {
          console.error('Backend error:', error);
          loading.dismiss();
          this.isSubmitting = false;
          
          let errorMessage = 'Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi nanti.';
          
          if (error.status === 422) {
            // Validation errors
            if (error.error && error.error.errors) {
              const errors = error.error.errors;
              errorMessage = Object.values(errors).reduce((acc: string[], val: any) => {
                if (Array.isArray(val)) {
                  return acc.concat(val);
                } else {
                  return acc.concat([val]);
                }
              }, []).join('\n');
            } else {
              errorMessage = 'Data yang dimasukkan tidak valid. Silakan periksa kembali.';
            }
          } else if (error.status === 401) {
            errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          this.showErrorAlert('Pengajuan Gagal', errorMessage);
        }
      });
    } catch (error: any) {
      console.error('Submit exception:', error);
      await loading.dismiss();
      this.isSubmitting = false;
      this.showErrorAlert('Error', 'Terjadi kesalahan sistem. Silakan coba lagi.');
    }
  }

  // Reset form
  resetForm() {
    this.formPinjaman = {
      jumlah: 1000000,
      jangka_waktu: 6,
      tujuan: '',
      agreeToTerms: false
    };
    this.formSubmitted = false;
    this.isSubmitting = false;
  }

  // Helper methods for alerts
  async showSuccessAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'error-alert'
    });
    await alert.present();
  }
}
