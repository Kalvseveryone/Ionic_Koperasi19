import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimpananPage } from './simpanan.page';

const routes: Routes = [
  {
    path: '',
    component: SimpananPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimpananPageRoutingModule {}
