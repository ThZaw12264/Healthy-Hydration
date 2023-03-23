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
              this.profiledata.loadLiveData(() => {
                this.goalspage.updateGraph();
              });
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

    //fill up step chart with demo values
    this.profiledata.userStepsData = [
      ["2023-03-19T00:15:00.864Z",0],
      ["2023-03-19T00:45:00.864Z",0],
      ["2023-03-19T01:15:00.864Z",0],
      ["2023-03-19T01:45:00.864Z",0],
      ["2023-03-19T02:15:00.864Z",500],
      ["2023-03-19T02:45:00.864Z",0],
      ["2023-03-19T03:15:00.864Z",100],
      ["2023-03-19T03:45:00.864Z",100],
      ["2023-03-19T04:15:00.864Z",300],
      ["2023-03-19T04:45:00.864Z",0],
      ["2023-03-19T05:15:00.864Z",400],
      ["2023-03-19T05:45:00.864Z",0]
    ];
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

  storeBodyInfo(name: string, gender: string, age: number, height: number, weight: number, stepsgoal: number, distancegoal: number, nrgburnedgoal: number, zipcode: number) {
    this.storage.set('name', name);
    this.storage.set('gender', gender);
    this.storage.set('age', age);
    this.storage.set('height', height);
    this.storage.set('weight', weight);
    this.storage.set('stepsgoal', stepsgoal);
    this.storage.set('distancegoal', distancegoal);
    this.storage.set('nrgburnedgoal', nrgburnedgoal);
    this.storage.set('zipcode', zipcode);
  }

  async loadJSONData() {
    const val = await this.storage.get('userdata');
    if (val) {
      return JSON.parse(val);
    } else {
      //calculate needs a 2D Matrix not a 1D, so fill with demo value for now
      this.storage.set('userdata', '[{"date": "2021-01-04", "body_water": 62.1, "water_drank": 2509.12, "activity_time": 14340.0, "avg_temp": 14.0, "avg_hum": 66.25, "score": 6}]');
      return this.loadJSONData();
      //return JSON.parse('[]');
    }
  }

  saveJSONData(JSONObject) {
    this.storage.set('userdata', JSON.stringify(JSONObject));
  }
}