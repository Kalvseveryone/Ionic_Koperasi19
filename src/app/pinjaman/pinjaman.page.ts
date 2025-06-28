import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../services/home.service';
import { PinjamanService } from '../services/pinjaman.service';

// Interface untuk data pinjaman
interface PinjamanData {
  id: number;
  anggota_id: string;
  anggota?: {
    nama: string;
  };
  jumlah: number;
  denda?: number;
  jangka_waktu: number;
  tujuan: string;
  status: 'pending' | 'disetujui' | 'ditolak' | 'aktif';
  catatan?: string;
  tanggal_pinjam: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk data simpanan transaksi yang sesuai dengan riwayat page
interface SimpananTransaction {
  id: number;
  type: 'income' | 'expense';
  title: string;
  date: string;
  amount: string;
  description?: string;
}

@Component({
  standalone: false,
  selector: 'app-pinjaman',
  templateUrl: './pinjaman.page.html',
  styleUrls: ['./pinjaman.page.scss'],
})
export class PinjamanPage implements OnInit {
  // Data pinjaman
  pinjamanList: PinjamanData[] = [];
  
  // Data simpanan
  simpananData = {
    total: 4200000,
    pokok: 500000,
    wajib: 1200000,
    sukarela: 2500000
  };

  // Data simpanan transaksi yang sesuai dengan riwayat page
  simpananTransaksi: SimpananTransaction[] = [];

  // Modal state
  isModalOpen = false;
  selectedPinjaman: PinjamanData | null = null;

  isLoading = false;
  activeTab = 'pinjaman'; // 'pinjaman' or 'simpanan'

  constructor(
    private navCtrl: NavController,
    private homeService: HomeService,
    private pinjamanService: PinjamanService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('PinjamanPage initialized');
    
    // Check for query parameters to set active tab
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['tab'] === 'simpanan') {
        this.activeTab = 'simpanan';
      }
    });
    
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    
    try {
      const loading = await this.loadingController.create({
        message: 'Memuat data...',
        spinner: 'crescent'
      });
      await loading.present();

      // Load pinjaman data from API
      this.pinjamanService.getPinjamanList().subscribe({
        next: (response: any) => {
          // Handle different response formats
          if (Array.isArray(response)) {
            this.pinjamanList = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            this.pinjamanList = response.data;
          } else {
            this.pinjamanList = [];
          }
          loading.dismiss();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading pinjaman data:', error);
          loading.dismiss();
          this.isLoading = false;
          this.showErrorToast('Gagal memuat data pinjaman');
        }
      });

      // Load simpanan data from service
      this.homeService.getSimpananSummary().subscribe({
        next: (data) => {
          this.simpananData = data;
        },
        error: (error) => {
          console.error('Error loading simpanan data:', error);
        }
      });

      // Load simpanan transaksi data yang sesuai dengan riwayat page
      this.loadSimpananTransaksi();

    } catch (error) {
      console.error('Error in loadData:', error);
      this.isLoading = false;
    }
  }

  // Load simpanan transaksi yang sesuai dengan riwayat page
  private loadSimpananTransaksi() {
    // Gunakan data yang sama dengan halaman riwayat
    this.homeService.getUserData().subscribe({
      next: (userData) => {
        this.simpananTransaksi = this.generateSimpananTransactionsFromUserData(userData);
      },
      error: (error) => {
        console.error('Error loading user data for simpanan transactions:', error);
        // Fallback ke data sample yang sesuai dengan riwayat page
        this.simpananTransaksi = this.getFallbackSimpananTransactions();
      }
    });
  }

  // Generate simpanan transactions dari user data (sama dengan riwayat page)
  private generateSimpananTransactionsFromUserData(userData: any): SimpananTransaction[] {
    const transactions: SimpananTransaction[] = [];
    
    // Add simpanan wajib transaction if exists
    if (parseFloat(userData.simpanan_wajib) > 0) {
      transactions.push({
        id: 1,
        type: 'income',
        title: 'Simpanan Wajib',
        date: this.homeService.formatDate(userData.updated_at),
        amount: this.homeService.formatCurrency(parseFloat(userData.simpanan_wajib))
      });
    }

    // Add simpanan sukarela transaction if exists
    if (parseFloat(userData.simpanan_sukarela) > 0) {
      transactions.push({
        id: 2,
        type: 'income',
        title: 'Simpanan Sukarela',
        date: this.homeService.formatDate(userData.updated_at),
        amount: this.homeService.formatCurrency(parseFloat(userData.simpanan_sukarela))
      });
    }

    // Add simpanan pokok transaction if exists
    if (parseFloat(userData.simpanan_pokok) > 0) {
      transactions.push({
        id: 3,
        type: 'income',
        title: 'Simpanan Pokok',
        date: this.homeService.formatDate(userData.created_at),
        amount: this.homeService.formatCurrency(parseFloat(userData.simpanan_pokok))
      });
    }

    return transactions;
  }

  // Fallback data yang sesuai dengan riwayat page
  private getFallbackSimpananTransactions(): SimpananTransaction[] {
    return [];
  }

  // Navigate back to home
  goBack() {
    this.navCtrl.back();
  }

  // Switch between pinjaman and simpanan tabs
  switchTab(tab: 'pinjaman' | 'simpanan') {
    this.activeTab = tab;
  }

  // Show detail modal
  showDetailModal(pinjaman: PinjamanData) {
    this.selectedPinjaman = pinjaman;
    this.isModalOpen = true;
  }

  // Close modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedPinjaman = null;
  }

  // Navigate to ajukan pinjaman
  ajukanPinjaman() {
    this.navCtrl.navigateForward('/ajukan');
  }

  // Get status label in Indonesian
  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Menunggu Persetujuan';
      case 'disetujui': return 'Disetujui';
      case 'ditolak': return 'Ditolak';
      case 'aktif': return 'Aktif';
      default: return status;
    }
  }

  // Get status badge class
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'disetujui': return 'bg-green-100 text-green-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
      case 'aktif': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Capitalize first letter
  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Show error toast
  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}
