import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BodyInfoPageRoutingModule } from './body-info-routing.module';

import { BodyInfoPage } from './body-info.page';

// const routes: Routes = [
//   {
//     path: 'body-info',
//     component: BodyInfoPage,
//     children: [
//       {
//         path: 'body-info',
//         loadChildren: () => import('../body-info/body-info.module').then( m => m.BodyInfoPageModule)
//       }
//     ]
//   },
//   {
//     path: '',
//     redirectTo: '/menu',
//     pathMatch: 'full'
//   }



// ];

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
