import { Component } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';
import { BodyInfoPage } from './pages/body-info/body-info.page';
import { ProfilePage } from './pages/profile/profile.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private storage: Storage, private modalCtrl: ModalController) {}

  async ngOnInit() {
    await this.storage.create();
    const infoEntered = await this.storage.get('name');
    const modal = await this.modalCtrl.create({
      component: BodyInfoPage,
    });

    if (infoEntered) {
      this.getStoredInfo();
    } else {
      modal.present();
    }
  }

  async getStoredInfo() {
    ProfilePage.varName = await this.storage.get('name');
    ProfilePage.varGender = await this.storage.get('gender');
    ProfilePage.varAge = await this.storage.get('age');
    ProfilePage.varHeight = await this.storage.get('height');
    ProfilePage.varWeight = await this.storage.get('weight');

    ProfilePage.userName = ProfilePage.varName;
    ProfilePage.userGender = ProfilePage.varGender;
    ProfilePage.userAge = ProfilePage.varAge;
    ProfilePage.userHeight = ProfilePage.varHeight;
    ProfilePage.userWeight = ProfilePage.varWeight;
  }

  async storeInfo(name: string, gender: string, age: number, height: number, weight: number) {
    await this.storage.set('name', name);
    await this.storage.set('gender', gender);
    await this.storage.set('age', age);
    await this.storage.set('height', height);
    await this.storage.set('weight', weight);
  }
}
