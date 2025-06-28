import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimpananPageRoutingModule } from './simpanan-routing.module';

import { SimpananPage } from './simpanan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimpananPageRoutingModule
  ],
  declarations: [SimpananPage]
})
export class SimpananPageModule {}
