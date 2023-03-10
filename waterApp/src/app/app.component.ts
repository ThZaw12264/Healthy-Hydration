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
    const infoEntered = await this.storage.get('BodyInfoEntered');
    const modal = await this.modalCtrl.create({
      component: BodyInfoPage,
    });

    if (infoEntered) {
      this.getStoredInfo();
    } else {
      modal.present();
      await this.storage.set('BodyInfoEntered', 'YES');     //move to after filling out info
    }
  }

  async getStoredInfo() {
    ProfilePage.usrName = await this.storage.get('name');
    ProfilePage.usrGender = await this.storage.get('gender');
    ProfilePage.usrAge = await this.storage.get('age');
    ProfilePage.usrHeight = await this.storage.get('height');
    ProfilePage.usrWeight = await this.storage.get('weight');
  }

  async storeInfo(name: string, gender: string, age: number, height: number, weight: number) {
    await this.storage.set('name', name);
    await this.storage.set('gender', gender);
    await this.storage.set('age', age);
    await this.storage.set('height', height);
    await this.storage.set('weight', weight);
  }
}
