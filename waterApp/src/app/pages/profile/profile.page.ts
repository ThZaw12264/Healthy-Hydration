import { Component, OnInit } from '@angular/core';

import { AppComponent } from 'src/app/app.component';
import { ProfileData } from './profile.data';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  constructor(private myapp: AppComponent, public profiledata: ProfileData) { }

  ngOnInit() { }

  saveGender(gender: string) { this.profiledata.varGender = gender }

  savePersonalInfo() {
    this.profiledata.changeUserInfo();
    this.myapp.storeBodyInfo(
      this.profiledata.userName,
      this.profiledata.userGender,
      this.profiledata.userAge,
      this.profiledata.userHeight,
      this.profiledata.userWeight
    );
  }

  // loadYesterdayData() {
  //   var steps = Array();
  //   var energyBurned = Array();

  //   for (let hour = 24; hour > 0; --hour) {
  //     let sd = new Date(new Date().getTime() - hour * 60 * 60 * 1000);
  //     let ed = new Date(new Date().getTime() - (hour - 1) * 60 * 60 * 1000);

  //     var stepOptions = {
  //       startDate: sd,
  //       endDate: ed,
  //       sampleType: 'HKQuantityTypeIdentifierStepCount',
  //       unit: 'count'
  //     }

  //     var nrgOptions = {
  //       startDate: sd,
  //       endDate: ed,
  //       sampleType: 'HKQuantityTypeIdentifierActiveEnergyBurned',
  //       energyUnit: 'cal'
  //     }

  //     this.healthKit.querySampleType(stepOptions).then(data => {
  //       let stepSum = data.reduce((a, b) => a + b.quantity, 0);
  //       steps.push(
  //         {'hour': 24-hour, 'steps': stepSum}
  //       );
  //     }, err => {
  //       console.log('No steps: ', err);
  //     });

  //     this.healthKit.querySampleType(nrgOptions).then(data => {
  //       let nrgSum = data.reduce((a, b) => a + b.quantity, 0);
  //       energyBurned.push(
  //         {'hour': 24-hour, 'steps': nrgSum}
  //       );
  //     }, err => {
  //       console.log('No energy burned: ', err);
  //     });
  //   }

  //   return {
  //     "steps": steps,
  //     "energyBurned": energyBurned
  //   }
  // }

  // cacheYesterdayData() {
  //   let userYesterdayData = this.loadYesterdayData();
  //   if (this.userMonthlyData.length == 28) {
  //     this.userMonthlyData.pop();
  //     this.userMonthlyData.unshift(userYesterdayData);
  //   } else {
  //     this.userMonthlyData.unshift(userYesterdayData);
  //   }
  // }
}
