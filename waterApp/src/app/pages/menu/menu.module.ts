import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'menu',
        loadChildren: () => import('../menu/menu.module').then( m => m.MenuPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/menu',
    pathMatch: 'full'
  }



];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
