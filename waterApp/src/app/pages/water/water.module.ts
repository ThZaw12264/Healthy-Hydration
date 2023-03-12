import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WaterPageRoutingModule } from './water-routing.module';

import { WaterPage } from './water.page';

// const routes: Routes = [
//   {
//     path: 'water',
//     component: WaterPage,
//     children: [
//       {
//         path: 'water',
//         loadChildren: () => import('./water.module').then( m => m.WaterPageModule)
//       }
//     ]
//   },
//   {
//     path: '',
//     redirectTo: '/water',
//     pathMatch: 'full'
//   }



// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaterPageRoutingModule
  ],
  declarations: [WaterPage]
})
export class WaterPageModule {}
