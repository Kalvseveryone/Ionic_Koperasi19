import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CacheClearService } from '../services/cache-clear.service';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  // Sample user profile data
  profile = {
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '081234567890',
    joinDate: '15 Mei 2022',
    photoUrl: '' // Empty for now - will use placeholder image
  };

  constructor(
    private router: Router,
    private storage: Storage,
    private alertController: AlertController,
    private authService: AuthService,
    private cacheClearService: CacheClearService
  ) { }

  ngOnInit() {
    // Load profile data from storage if available
    this.loadProfileData();
  }

  async loadProfileData() {
    // First try to get user data from AuthService
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profile = {
        name: currentUser.name,
        email: currentUser.email,
        phone: '', // Phone not available in User model
        joinDate: currentUser.createdAt
          ? new Date(currentUser.createdAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : '-',
        photoUrl: ''
      };
      console.log('Using user data from AuthService:', currentUser.name);
    } else {
      // Fallback to storage data if AuthService doesn't have user data
      const userData = await this.storage.get('userData');
      if (userData) {
        this.profile = { ...this.profile, ...userData };
        console.log('Using fallback data from storage');
      } else {
        console.log('No user data available, using default profile');
      }
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Mohon pilih file gambar');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
      }

      try {
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          const base64String = e.target.result;
          
          // Update profile photo URL
          this.profile.photoUrl = base64String;
          
          // Save to storage
          await this.storage.set('userData', {
            ...this.profile,
            photoUrl: base64String
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Gagal memproses gambar');
      }
    }
  }

  // Change profile photo
  changeProfilePhoto() {
    console.log('Change profile photo clicked');
    // Here you would typically implement photo selection and upload
    // For example, open a file picker or camera
    alert('Fitur ganti foto profil akan segera tersedia');
  }

  // Logout
  async logout() {
    console.log('Logout clicked');
    
    // Show confirmation dialog
    const alert = await this.alertController.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Ya, Keluar',
          handler: async () => {
            try {
              // Clear all service caches first
              this.cacheClearService.clearAllCaches();
              
              // Use AuthService to logout (this will clear tokens and navigate to login)
              await this.authService.logout();
              
              console.log('Logout successful');
            } catch (error) {
              console.error('Logout error:', error);
              // Even if logout fails, still navigate to login
              this.router.navigate(['/login']);
            }
          }
        }
      ]
    });
    
    await alert.present();
  }
}
