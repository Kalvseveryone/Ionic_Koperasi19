import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class WelcomePage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  contactAdmin() {
    const phoneNumber = '6282123996315';
    const message = 'Halo Admin, saya ingin mendaftar sebagai anggota.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Buka WhatsApp di browser atau aplikasi
    window.open(whatsappUrl, '_blank');
  }
} 