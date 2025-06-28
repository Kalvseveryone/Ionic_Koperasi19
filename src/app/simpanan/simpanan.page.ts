import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-simpanan',
  templateUrl: './simpanan.page.html',
  styleUrls: ['./simpanan.page.scss'],
})
export class SimpananPage implements OnInit {
  currentDate = new Date();
  
  // Simpanan Pokok
  simpananPokok = 500000;
  tanggalSimpananPokok = '10 Jan 2023';
  
  // Simpanan Wajib
  simpananWajib = {
    total: 1200000,
    perBulan: 100000,
    tanggalTerakhir: '15 Jun 2023',
    jatuhTempo: '15 Jul 2023',
    status: true
  };
  
  // Simpanan Sukarela
  simpananSukarela = {
    total: 2500000,
    tanggalTerakhir: '20 Jun 2023',
    jumlahTerakhir: 500000
  };
  
  // Calculate total simpanan
  get totalSimpanan() {
    return this.simpananPokok + this.simpananWajib.total + this.simpananSukarela.total;
  }

  constructor(
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    // You could fetch data from an API here
    console.log('SimpananPage initialized');
  }
  
  // Navigation method
  goBack() {
    this.router.navigateByUrl('/home');
  }
  
  // Format currency amount
  formatAmount(amount: number): string {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  // Methods for Simpanan Wajib payment
  async bayarSimpananWajib() {
    const alert = await this.alertController.create({
      header: 'Bayar Simpanan Wajib',
      message: 'Anda akan membayar simpanan wajib sebesar Rp ' + this.formatAmount(this.simpananWajib.perBulan),
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Bayar',
          handler: () => {
            // Add payment logic here (in real app would connect to a payment service)
            this.simpananWajib.total += this.simpananWajib.perBulan;
            this.simpananWajib.tanggalTerakhir = new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            
            // Calculate next due date (1 month from now)
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            this.simpananWajib.jatuhTempo = nextMonth.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            
            this.showSuccessAlert('Pembayaran Berhasil', 'Simpanan wajib telah berhasil dibayarkan.');
            return true;
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  // Methods for Simpanan Sukarela
  async tambahSimpananSukarela() {
    const alert = await this.alertController.create({
      header: 'Tambah Simpanan Sukarela',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Masukkan jumlah (Rp)'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Simpan',
          handler: (data) => {
            if (data.amount && Number(data.amount) > 0) {
              const amount = Number(data.amount);
              this.simpananSukarela.total += amount;
              this.simpananSukarela.jumlahTerakhir = amount;
              this.simpananSukarela.tanggalTerakhir = new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              this.showSuccessAlert('Simpanan Berhasil', 'Simpanan sukarela telah berhasil ditambahkan.');
              return true;
            } else {
              this.showErrorAlert('Jumlah tidak valid', 'Silakan masukkan jumlah yang valid.');
              return false;
            }
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  async tarikSimpananSukarela() {
    const alert = await this.alertController.create({
      header: 'Tarik Simpanan Sukarela',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Masukkan jumlah (Rp)'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Tarik',
          handler: (data) => {
            if (data.amount && Number(data.amount) > 0) {
              const amount = Number(data.amount);
              
              if (amount > this.simpananSukarela.total) {
                this.showErrorAlert('Saldo tidak cukup', 'Jumlah penarikan melebihi saldo simpanan sukarela Anda.');
                return false;
              }
              
              this.simpananSukarela.total -= amount;
              this.simpananSukarela.jumlahTerakhir = amount;
              this.simpananSukarela.tanggalTerakhir = new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              this.showSuccessAlert('Penarikan Berhasil', 'Penarikan simpanan sukarela telah berhasil.');
              return true;
            } else {
              this.showErrorAlert('Jumlah tidak valid', 'Silakan masukkan jumlah yang valid.');
              return false;
            }
          }
        }
      ]
    });
    
    await alert.present();
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
