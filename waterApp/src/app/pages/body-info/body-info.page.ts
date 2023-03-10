import { Component, OnInit } from '@angular/core';

import { ProfilePage } from '../profile/profile.page';
import { ModalController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-body-info',
  templateUrl: './body-info.page.html',
  styleUrls: ['./body-info.page.scss'],
})
export class BodyInfoPage implements OnInit {
  profile: ProfilePage;

  constructor(private modalCtrl: ModalController, pp: ProfilePage, public myapp: AppComponent) {this.profile = pp}

  ngOnInit() {}

  confirm() {
    if (ProfilePage.usrName && ProfilePage.usrGender && ProfilePage.usrAge && ProfilePage.usrHeight && ProfilePage.usrWeight) {
      this.myapp.storeInfo(
        ProfilePage.usrName, 
        ProfilePage.usrGender, 
        ProfilePage.usrAge, 
        ProfilePage.usrHeight, 
        ProfilePage.usrWeight
      );
      this.modalCtrl.dismiss('confirm');
    }
  }
}
