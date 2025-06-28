import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { HomeService, HomeData, Transaction } from '../services/home.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  userName: string = 'User'; // Default value
  currentDate: Date = new Date();
  totalSimpanan: string = 'Rp 0';
  
  pinjaman = {
    status: 'Tidak Ada',
    amount: 'Rp 0',
    dueDate: '-',
    progress: 0
  };
  
  recentTransactions: Transaction[] = [];
  
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private storage: Storage,
    private homeService: HomeService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private authService: AuthService
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async ngOnInit() {
    await this.loadHomeData();
  }

  async loadHomeData() {
    this.isLoading = true;
    
    try {
      // Show loading
      const loading = await this.loadingController.create({
        message: 'Memuat data...',
        spinner: 'crescent'
      });
      await loading.present();

      // Get home data from API
      this.homeService.getHomeData().subscribe({
        next: (data: HomeData) => {
          this.updateHomeData(data);
          loading.dismiss();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading home data:', error);
          this.showErrorToast('Gagal memuat data homepage');
          loading.dismiss();
          this.isLoading = false;
          
          // Fallback to storage data
          this.loadFallbackData();
        }
      });
    } catch (error) {
      console.error('Error in loadHomeData:', error);
      this.isLoading = false;
      this.loadFallbackData();
    }
  }

  private updateHomeData(data: HomeData) {
    // Update user name from the actual API response
    this.userName = data.user.nama;
    
    // Update simpanan
    this.totalSimpanan = this.homeService.formatCurrency(data.simpanan.total);
    
    // Update pinjaman
    this.pinjaman = {
      status: data.pinjaman.status,
      amount: this.homeService.formatCurrency(data.pinjaman.amount),
      dueDate: data.pinjaman.dueDate,
      progress: data.pinjaman.progress
    };
    
    // Update recent transactions (already formatted in service)
    this.recentTransactions = data.recentTransactions;
  }

  private async loadFallbackData() {
    // First try to get user data from AuthService
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.name) {
      this.userName = currentUser.name;
      console.log('Using user data from AuthService:', currentUser.name);
    } else {
      // Fallback to storage data if AuthService doesn't have user data
      const userData = await this.storage.get('userData');
      if (userData && userData.name) {
        this.userName = userData.name;
        console.log('Using fallback data from storage:', userData.name);
      } else {
        console.log('No user data available, using default');
      }
    }
    
    // Keep default values for other data
    console.log('Using fallback data');
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  // Refresh data
  async refreshData(event: any) {
    await this.loadHomeData();
    event.target.complete();
  }

  navigateToPinjaman() {
    this.router.navigateByUrl('/pinjaman');
  }
  
  navigateToRiwayat() {
    this.router.navigateByUrl('/riwayat');
  }

  navigateToAjukan() {
    this.router.navigateByUrl('/ajukan');
  }

  // Navigate to pinjaman page with simpanan tab
  navigateToDetailSimpanan() {
    this.router.navigate(['/pinjaman'], { 
      queryParams: { tab: 'simpanan' } 
    });
  }

  navigateTo(page: string) {
    console.log('Navigating to:', page);
    // Implement navigation
  }
} 