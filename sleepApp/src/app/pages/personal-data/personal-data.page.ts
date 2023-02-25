import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx/index';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.page.html',
  styleUrls: ['./personal-data.page.scss'],
})

export class PersonalDataPage implements OnInit {
  usrHeight = 0;
  usrWeight = 0;
  usrAge = 0;
  usrGender = 'No Data';
  //queue of data from past 4 weeks
  usrMonthlyData = []     

  constructor(private healthKit: HealthKit, private plt: Platform) {
    this.plt.ready().then(() => {
      this.healthKit.available().then(available => {
        if (available) {
          var options: HealthKitOptions = {
            readTypes: ['HKQuantityTypeIdentifierHeight', 'HKQuantityTypeIdentifierStepCount', 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierActiveEnergyBurned'],
          }
          this.healthKit.requestAuthorization(options).then(_ => {
            //this.loadHealthData();
          })
        }
      });
    });
  }

  ngOnInit() { }

  savePersonalInfo() {
    // this.healthKit.saveHeight({ unit: 'cm', amount: this.usrHeight }).then(_ => {
    //   this.loadHealthData();
    // })
    console.log(this.usrHeight, this.usrWeight, this.usrAge);
  }

  loadYesterdayData() {
    // 'usrSleepTime' = ;
    // 'usrSteps' = [];
    // 'usr'
  }

  cacheYesterdayData() {
    // let usrYesterdayData = loadYesterdayData();

    // this.usrMonthData.unshift(usrData)
  }

  // loadHealthData() {
  //   this.healthKit.readHeight({ unit: 'cm' }).then(val => {
  //     this.currentHeight = val.value;
  //   }, err => {
  //     console.log('No height: ', err);
  //   });

  //   var stepOptions = {
  //     startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  //     endDate: new Date(),
  //     sampleType: 'HKQuantityTypeIdentifierStepCount',
  //     unit: 'count'
  //   }

  //   this.healthKit.querySampleType(stepOptions).then(data => {
  //     let stepSum = data.reduce((a, b) => a + b.quantity, 0);
  //     this.stepcount = stepSum;
  //   }, err => {
  //     console.log('No steps: ', err);
  //   });

  //   this.healthKit.findWorkouts().then(data => {
  //     this.workouts = data;
  //   }, err => {
  //     console.log('no workouts: ', err);
  //     // Sometimes the result comes in here, very strange.
  //     this.workouts = err;
  //   });
  // }
}
