import { Component, OnInit } from '@angular/core';

import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';

import { BodyInfoPage } from './pages/body-info/body-info.page';
import { ProfileData } from './pages/profile/profile.data';
import { GoalsPage } from './pages/goals/goals.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  constructor(public healthkit: HealthKit, private plt: Platform, private storage: Storage, private modalCtrl: ModalController, private profiledata: ProfileData, private goalspage: GoalsPage) {
    this.profiledata.healthKit = healthkit;
  }

  async ngOnInit() {
    this.plt.ready().then(() => {
      this.profiledata.healthKit.available().then(available => {
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
            ],
            writeTypes: [
              'HKQuantityTypeIdentifierHeight',
              'HKQuantityTypeIdentifierBodyMass'
            ]
          }
          this.profiledata.healthKit.requestAuthorization(options).then(_ => {
            this.profiledata.loadTodaysData();
            this.profiledata.loadLast6HrsData();
            this.profiledata.timer = setInterval(() => {
              this.profiledata.loadLiveData();
              this.goalspage.updateGraph();
            }, 60000);
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
    this.profiledata.varName = await this.storage.get('name');
    this.profiledata.varGender = await this.storage.get('gender');
    this.profiledata.varAge = await this.storage.get('age');
    this.profiledata.varHeight = await this.storage.get('height');
    this.profiledata.varWeight = await this.storage.get('weight');
    this.profiledata.varStepsGoal = await this.storage.get('stepsgoal');
    this.profiledata.varDistanceGoal = await this.storage.get('distancegoal');
    this.profiledata.varNrgBurnedGoal = await this.storage.get('nrgburnedgoal');
    this.profiledata.varZIPCode = await this.storage.get('zipcode');
    this.profiledata.changeUserInfo();
  }

  async storeBodyInfo(name: string, gender: string, age: number, height: number, weight: number, stepsgoal: number, distancegoal: number, nrgburnedgoal: number, zipcode: number) {
    await this.storage.set('name', name);
    await this.storage.set('gender', gender);
    await this.storage.set('age', age);
    await this.storage.set('height', height);
    await this.storage.set('weight', weight);
    await this.storage.set('stepsgoal', stepsgoal);
    await this.storage.set('distancegoal', distancegoal);
    await this.storage.set('nrgburnedgoal', nrgburnedgoal);
    await this.storage.set('zipcode', zipcode);
  }
}
