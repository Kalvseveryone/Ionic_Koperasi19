import { Injectable } from '@angular/core';
import { HomeService } from './home.service';
import { SimpananService } from './simpanan.service';
import { PinjamanService } from './pinjaman.service';

@Injectable({
  providedIn: 'root'
})
export class CacheClearService {
  constructor(
    private homeService: HomeService,
    private simpananService: SimpananService,
    private pinjamanService: PinjamanService
  ) {}

  // Clear all service caches
  clearAllCaches(): void {
    console.log('Clearing all service caches...');
    this.homeService.clearCache();
    this.simpananService.clearCache();
    this.pinjamanService.clearCache();
    console.log('All service caches cleared successfully');
  }
} 