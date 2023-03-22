import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GoalsPage } from './pages/goals/goals.page';
import { ProfilePage } from './pages/profile/profile.page';

import { HealthKit } from '@ionic-native/health-kit/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, HealthKit, ProfilePage, GoalsPage, AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }