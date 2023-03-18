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
  constructor(private modalCtrl: ModalController, public profilepage: ProfilePage, public profiledata: ProfileData) { }

  ngOnInit() { }

  confirm() {
    if (this.profiledata.varName && this.profiledata.varGender && this.profiledata.varAge && this.profiledata.varHeight && this.profiledata.varWeight && this.profiledata.varStepsGoal) {
      this.profilepage.savePersonalInfo();
      this.modalCtrl.dismiss('confirm');
    }
  }
}
