import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HealthKit } from '@ionic-native/health-kit/ngx/index';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ProfilePage } from './pages/profile/profile.page';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, HealthKit, ProfilePage, AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}