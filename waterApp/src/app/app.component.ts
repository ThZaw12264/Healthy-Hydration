import { Component, OnInit } from '@angular/core';

import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';

import { BodyInfoPage } from './pages/body-info/body-info.page';
import { ProfileData } from './pages/profile/profile.data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  constructor(public healthkit: HealthKit, private plt: Platform, private storage: Storage, private modalCtrl: ModalController) {
    ProfileData.healthKit = healthkit;
  }

  async ngOnInit() {
    this.plt.ready().then(() => {
      ProfileData.healthKit.available().then(available => {
        if (available) {
          var options: HealthKitOptions = {
            readTypes: [
              'HKQuantityTypeIdentifierHeight',
              'HKQuantityTypeIdentifierBodyMass',
              'HKQuantityTypeIdentifierStepCount',
              'HKQuantityTypeIdentifierDistanceWalkingRunning',
              'HKQuantityTypeIdentifierActiveEnergyBurned',
              'HKQuantityTypeIdentifierAppleExerciseTime',
              'HKQuantityTypeIdentifierAppleMoveTime',
              'HKQuantityTypeIdentifierAppleStandTime',
              'HKQuantityTypeIdentifierHeartRate',
              'HKQuantityTypeIdentifierRestingHeartRate',
              'HKCategoryTypeIdentifierSleepAnalysis'
            ],
            writeTypes: [
              'HKQuantityTypeIdentifierHeight',
              'HKQuantityTypeIdentifierBodyMass'
            ]
          }
          ProfileData.healthKit.requestAuthorization(options).then(_ => {
            ProfileData.load12HrStepData();
            ProfileData.loadLiveStepData();
          });
        }
      }, err => {
        console.log('Device is not compatible with IOS HealthKit', err);
      });
    });

    await this.storage.create();
    const infoEntered = await this.storage.get('name');
    const modal = await this.modalCtrl.create({
      component: BodyInfoPage,
    });

    if (infoEntered) {
      this.getStoredBodyInfo();
    } else {
      modal.present();
    }
  }

  async getStoredBodyInfo() {
    ProfileData.varName = await this.storage.get('name');
    ProfileData.varGender = await this.storage.get('gender');
    ProfileData.varAge = await this.storage.get('age');
    ProfileData.varHeight = await this.storage.get('height');
    ProfileData.varWeight = await this.storage.get('weight');

    ProfileData.userName = ProfileData.varName;
    ProfileData.userGender = ProfileData.varGender;
    ProfileData.userAge = ProfileData.varAge;
    ProfileData.userHeight = ProfileData.varHeight;
    ProfileData.userWeight = ProfileData.varWeight;
  }

  async storeBodyInfo(name: string, gender: string, age: number, height: number, weight: number) {
    await this.storage.set('name', name);
    await this.storage.set('gender', gender);
    await this.storage.set('age', age);
    await this.storage.set('height', height);
    await this.storage.set('weight', weight);
  }
}
