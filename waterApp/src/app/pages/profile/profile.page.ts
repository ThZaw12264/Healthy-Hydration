import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx/index';
import { AppComponent } from 'src/app/app.component';

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
  usrMonthlyData = Array();   
  usrTodayData = Array();  

  public profileReference = ProfilePage;

  constructor(private healthKit: HealthKit, private plt: Platform, public myapp: AppComponent) {
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
          this.healthKit.requestAuthorization(options);
        }
      }, err => {
        console.log('Device is not compatible with IOS HealthKit', err);
      });
    });
  }

  ngOnInit() {}

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
