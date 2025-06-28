import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { HomeService, Transaction } from '../services/home.service';

// Define interfaces for type safety
interface MonthGroup {
  month: string;
  transactions: Transaction[];
}

@Component({
  standalone: false,
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
})
export class RiwayatPage implements OnInit {
  // Filter options
  filters = [
    { id: 'all', name: 'Semua' },
    { id: 'income', name: 'Pemasukan' },
    { id: 'expense', name: 'Pengeluaran' }
  ];
  
  activeFilter = 'all';
  
  // All transactions data grouped by month
  allTransactions: MonthGroup[] = [];
  
  // Filtered transactions based on active filter
  filteredTransactions: MonthGroup[] = [];
  
  // Loading state
  isLoading = false;

  constructor(
    private homeService: HomeService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadTransactionData();
  }
  
  // Set active filter and update filtered transactions
  setFilter(filterId: string) {
    this.activeFilter = filterId;
    this.filterTransactions();
  }
  
  // Load transaction data from API
  async loadTransactionData() {
    this.isLoading = true;
    
    try {
      const loading = await this.loadingController.create({
        message: 'Memuat riwayat transaksi...',
        spinner: 'crescent'
      });
      await loading.present();

      // Get user data and generate transactions (same as homepage but without limit)
      this.homeService.getUserData().subscribe({
        next: (userData) => {
          const transactions = this.generateTransactionsFromUserData(userData);
          this.processTransactionData(transactions);
          loading.dismiss();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading transaction data:', error);
          this.showErrorToast('Gagal memuat riwayat transaksi');
          loading.dismiss();
          this.isLoading = false;
          
          // Fallback to sample data
          this.loadFallbackData();
        }
      });

    } catch (error) {
      console.error('Error in loadTransactionData:', error);
      this.isLoading = false;
      this.loadFallbackData();
    }
  }

  // Generate transactions from user data (same logic as homepage but without limit)
  private generateTransactionsFromUserData(userData: any): Transaction[] {
    const transactions: Transaction[] = [];
    
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

    // Add pinjaman transaction if exists
    if (parseFloat(userData.total_pinjaman) > 0) {
      transactions.push({
        id: 4,
        type: 'expense',
        title: 'Pinjaman',
        date: this.homeService.formatDate(userData.created_at),
        amount: this.homeService.formatCurrency(parseFloat(userData.total_pinjaman))
      });
    }

    // Add denda transaction if exists
    if (parseFloat(userData.total_denda) > 0) {
      transactions.push({
        id: 5,
        type: 'expense',
        title: 'Denda',
        date: this.homeService.formatDate(userData.updated_at),
        amount: this.homeService.formatCurrency(parseFloat(userData.total_denda))
      });
    }

    return transactions;
  }

  // Process transaction data and group by month
  private processTransactionData(transactions: Transaction[]) {
    // Group transactions by month
    const groupedTransactions = this.groupTransactionsByMonth(transactions);
    this.allTransactions = groupedTransactions;
    this.filterTransactions();
  }

  // Group transactions by month
  private groupTransactionsByMonth(transactions: Transaction[]): MonthGroup[] {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      
      groups[monthKey].push(transaction);
    });

    // Convert to array and sort by date (newest first)
    return Object.keys(groups)
      .map(month => ({
        month,
        transactions: groups[month].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }))
      .sort((a, b) => {
        const dateA = new Date(a.transactions[0]?.date || 0);
        const dateB = new Date(b.transactions[0]?.date || 0);
        return dateB.getTime() - dateA.getTime();
      });
  }
  
  // Filter transactions based on active filter
  filterTransactions() {
    if (this.activeFilter === 'all') {
      this.filteredTransactions = this.allTransactions;
      return;
    }
    
    // Filter transactions by type
    this.filteredTransactions = this.allTransactions
      .map(month => {
        // Create a new month object with filtered transactions
        const filteredMonth: MonthGroup = {
          month: month.month,
          transactions: month.transactions.filter(t => t.type === this.activeFilter)
        };
        
        return filteredMonth;
      })
      .filter(month => month.transactions.length > 0); // Only include months with transactions
  }

  // Fallback to sample data if API fails
  private loadFallbackData() {
    this.allTransactions = [];
    this.filterTransactions();
  }

  // Show error toast
  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }
}
