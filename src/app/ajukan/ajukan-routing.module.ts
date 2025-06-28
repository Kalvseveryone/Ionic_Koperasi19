import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjukanPage } from './ajukan.page';

const routes: Routes = [
  {
    path: '',
    component: AjukanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjukanPageRoutingModule {}
