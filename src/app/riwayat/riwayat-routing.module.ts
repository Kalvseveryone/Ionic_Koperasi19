import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiwayatPage } from './riwayat.page';

const routes: Routes = [
  {
    path: '',
    component: RiwayatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiwayatPageRoutingModule {}
