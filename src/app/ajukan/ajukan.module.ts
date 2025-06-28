import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjukanPageRoutingModule } from './ajukan-routing.module';

import { AjukanPage } from './ajukan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjukanPageRoutingModule
  ],
  declarations: [AjukanPage]
})
export class AjukanPageModule {}
