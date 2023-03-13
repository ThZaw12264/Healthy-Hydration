import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx/index';
import { AppComponent } from 'src/app/app.component';
import { GoalsPage } from '../goals/goals.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  //ng variable, not used for calculations
  public static varName: string;
  public static varGender: string;
  public static varAge: number;
  public static varHeight: number;
  public static varWeight: number;
  //saved body data used for calculations
  public static userName: string;
  public static userGender: string;
  public static userAge: number;
  public static userHeight: number;
  public static userWeight: number;
  //queue of data from past 4 weeks
  userMonthlyData = Array();   
  userTodayData = Array();
  public static userStepsData = Array();

  private timer: any;

  public profileReference = ProfilePage;

  constructor(private healthKit: HealthKit, private plt: Platform, public goalspage: GoalsPage, public myapp: AppComponent) {
    this.plt.ready().then(() => {
      this.healthKit.available().then(available => {
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
          this.healthKit.requestAuthorization(options).then(_ => {
            this.load12HrStepData();
            this.loadLiveStepData();
          })
        }
      }, err => {
        console.log('Device is not compatible with IOS HealthKit', err);
      });
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  saveGender(gender: string) { ProfilePage.varGender = gender }

  savePersonalInfo() {
    ProfilePage.userName = ProfilePage.varName;
    ProfilePage.userGender = ProfilePage.varGender;
    ProfilePage.userAge = ProfilePage.varAge;
    ProfilePage.userHeight = ProfilePage.varHeight;
    ProfilePage.userWeight = ProfilePage.varWeight;
    this.healthKit.saveHeight({ unit: 'in', amount: ProfilePage.userHeight });
    this.healthKit.saveWeight({ unit: 'lb', amount: ProfilePage.userWeight });
    this.myapp.storeInfo(
      ProfilePage.userName, 
      ProfilePage.userGender, 
      ProfilePage.userAge, 
      ProfilePage.userHeight, 
      ProfilePage.userWeight
    );
  }

  load12HrStepData() {
    for (let halfhour = 24; halfhour > 0; --halfhour) {
      let sd = new Date(new Date().getTime() - halfhour * 1800 * 1000);
      let ed = new Date(new Date().getTime() - (halfhour - 1) * 1800 * 1000);

      var stepOptions = {
        startDate: sd,
        endDate: ed,
        sampleType: 'HKQuantityTypeIdentifierStepCount',
        unit: 'count'
      }

      this.healthKit.querySampleType(stepOptions).then(data => {
        let stepSum = data.reduce((a, b) => a + b.quantity, 0);
        ProfilePage.userStepsData.push(
          {'time': new Date((sd.getTime() + ed.getTime()) / 2), 'steps': stepSum}
        );
      }, err => {
        console.log('No steps: ', err);
      });
    }
    console.log(ProfilePage.userStepsData);
  }

  loadLiveStepData() {
    this.timer = setInterval(() => {
      let sd = new Date(new Date().getTime() - 1800 * 1000);
      let ed = new Date();

      var stepOptions = {
        startDate: sd,
        endDate: ed,
        sampleType: 'HKQuantityTypeIdentifierStepCount',
        unit: 'count'
      }

      this.healthKit.querySampleType(stepOptions).then(data => {
        let stepSum = data.reduce((a, b) => a + b.quantity, 0);
        let date = new Date((sd.getTime() + ed.getTime()) / 2);

        ProfilePage.userStepsData.shift()
        ProfilePage.userStepsData.push({
          name: date.toString(),
          value: [
            [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') + 'T' + [date.getHours(), date.getMinutes()].join(':'),
            Math.round(stepSum)
          ]
        });
        this.goalspage.updateGraph();
      }, err => {
        console.log('No steps: ', err);
      });
    }, 60000 * 30);
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
    let userYesterdayData = this.loadYesterdayData();
    if (this.userMonthlyData.length == 28) {
      this.userMonthlyData.pop();
      this.userMonthlyData.unshift(userYesterdayData);
    } else {
      this.userMonthlyData.unshift(userYesterdayData);
    }
  }
}
