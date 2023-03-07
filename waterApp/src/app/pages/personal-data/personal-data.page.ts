import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx/index';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.page.html',
  styleUrls: ['./personal-data.page.scss'],
})

export class PersonalDataPage implements OnInit {
  //default info for the average human
  usrHeight = 65;
  usrWeight = 135;
  usrAge = 25;
  usrGender = 'male';
  //queue of data from past 4 weeks
  usrMonthlyData = Array();     

  constructor(private healthKit: HealthKit, private plt: Platform) {
    this.plt.ready().then(() => {
      this.healthKit.available().then(available => {
        if (available) {
          var options: HealthKitOptions = {
            readTypes: [
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
          }
          this.healthKit.requestAuthorization(options).then(_ => {
            //this.loadHealthData();
          })
        }
      });
    });
  }

  ngOnInit() { }

  saveGenderMale() { this.usrGender = 'male' }
  saveGenderFemale() { this.usrGender = 'female' }

  savePersonalInfo() {
    // this.healthKit.saveHeight({ unit: 'cm', amount: this.usrHeight }).then(_ => {
    //   this.loadHealthData();
    // })
    console.log(this.usrHeight, this.usrWeight, this.usrAge);
  }

  loadYesterdayData() {
    var steps = Array();
    var energyBurned = Array();

    for (let hour = 24; hour > 0; --hour) {
      let sd = new Date(new Date().getTime() - hour * 60 * 60 * 1000);
      let ed = new Date(new Date().getTime() - (hour - 1) * 60 * 60 * 1000);

      var stepOptions = {
        startDate: sd,
        endDate: ed,
        sampleType: 'HKQuantityTypeIdentifierStepCount',
        unit: 'count'
      }

      var nrgOptions = {
        startDate: sd,
        endDate: ed,
        sampleType: 'HKQuantityTypeIdentifierActiveEnergyBurned',
        energyUnit: 'cal'
      }

      this.healthKit.querySampleType(stepOptions).then(data => {
        let stepSum = data.reduce((a, b) => a + b.quantity, 0);
        steps.push(
          {'hour': 24-hour, 'steps': stepSum}
        );
      }, err => {
        console.log('No steps: ', err);
      });

      this.healthKit.querySampleType(nrgOptions).then(data => {
        let nrgSum = data.reduce((a, b) => a + b.quantity, 0);
        energyBurned.push(
          {'hour': 24-hour, 'steps': nrgSum}
        );
      }, err => {
        console.log('No energy burned: ', err);
      });
    }

    return {
      "steps": steps,
      "energyBurned": energyBurned
    }
  }

  cacheYesterdayData() {
    let usrYesterdayData = this.loadYesterdayData();
    if (this.usrMonthlyData.length == 28) {
      this.usrMonthlyData.pop();
      this.usrMonthlyData.unshift(usrYesterdayData);
    } else {
      this.usrMonthlyData.unshift(usrYesterdayData);
    }
  }
}
