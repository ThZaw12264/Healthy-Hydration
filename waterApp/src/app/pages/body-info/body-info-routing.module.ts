import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BodyInfoPage } from './body-info.page';

const routes: Routes = [
  {
    path: '',
    component: BodyInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BodyInfoPageRoutingModule {}
