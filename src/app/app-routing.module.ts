import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () => import('./welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pinjaman',
    loadChildren: () => import('./pinjaman/pinjaman.module').then( m => m.PinjamanPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ajukan',
    loadChildren: () => import('./ajukan/ajukan.module').then( m => m.AjukanPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'riwayat',
    loadChildren: () => import('./riwayat/riwayat.module').then( m => m.RiwayatPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'simpanan',
    loadChildren: () => import('./simpanan/simpanan.module').then( m => m.SimpananPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
