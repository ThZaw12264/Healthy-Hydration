import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BodyInfoPageRoutingModule } from './body-info-routing.module';

import { BodyInfoPage } from './body-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BodyInfoPageRoutingModule
  ],
  declarations: [BodyInfoPage]
})
export class BodyInfoPageModule {}
