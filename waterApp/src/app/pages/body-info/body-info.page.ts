import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';
import { ProfileData } from '../profile/profile.data';

@Component({
  selector: 'app-body-info',
  templateUrl: './body-info.page.html',
  styleUrls: ['./body-info.page.scss'],
})
export class BodyInfoPage implements OnInit {
  profileDataReference = ProfileData;

  constructor(private modalCtrl: ModalController, public profilepage: ProfilePage) { }

  ngOnInit() { }

  confirm() {
    if (ProfileData.varName && ProfileData.varGender && ProfileData.varAge && ProfileData.varHeight && ProfileData.varWeight) {
      this.profilepage.savePersonalInfo();
      this.modalCtrl.dismiss('confirm');
    }
  }
}
