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
  profileReference = ProfilePage;

  constructor(private modalCtrl: ModalController, public profile: ProfilePage, private myapp: AppComponent) {}

  ngOnInit() {}

  confirm() {
    if (ProfilePage.varName && ProfilePage.varGender && ProfilePage.varAge && ProfilePage.varHeight && ProfilePage.varWeight) {
      this.profile.savePersonalInfo();
      this.modalCtrl.dismiss('confirm');
    }
  }
}
