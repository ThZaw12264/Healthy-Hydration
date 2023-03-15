import { Injectable } from '@angular/core';
import { HealthKit } from '@ionic-native/health-kit/ngx';
import { GoalsPage } from '../goals/goals.page';

@Injectable({
    providedIn: 'root'
})
export class ProfileData {
    public static healthKit: HealthKit
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

    //step count for past 6 hours
    public static userStepsData: any = [];
    public static timer: any

    public static changeUserInfo() {
        ProfileData.userName = ProfileData.varName;
        ProfileData.userGender = ProfileData.varGender;
        ProfileData.userAge = ProfileData.varAge;
        ProfileData.userHeight = ProfileData.varHeight;
        ProfileData.userWeight = ProfileData.varWeight;
        ProfileData.healthKit.saveHeight({ unit: 'in', amount: ProfileData.userHeight });
        ProfileData.healthKit.saveWeight({ unit: 'lb', amount: ProfileData.userWeight });
    }

    public static queryStepCount(sd: Date, ed: Date) {
        var stepOptions = {
            startDate: sd,
            endDate: ed,
            sampleType: 'HKQuantityTypeIdentifierStepCount',
            unit: 'count'
        }

        ProfileData.healthKit.querySampleType(stepOptions).then(data => {
            let stepSum = data.reduce((a, b) => a + b.quantity, 0);
            let date = new Date((sd.getTime() + ed.getTime()) / 2);

            return {
                name: date.toString(),
                value: [
                    [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') + 'T' + [date.getHours(), date.getMinutes()].join(':'),
                    Math.round(stepSum)
                ]
            };
        }, err => {
            console.log('No steps: ', err);
        });
    }

    public static load12HrStepData() {
        for (let halfhour = 12; halfhour > 0; --halfhour) {
            let sd = new Date(new Date().getTime() - halfhour * 1800 * 1000);
            let ed = new Date(new Date().getTime() - (halfhour - 1) * 1800 * 1000);
            ProfileData.userStepsData.push(ProfileData.queryStepCount(sd, ed));
        }
    }

    public static loadLiveStepData() {
        ProfileData.timer = setInterval(() => {
            let sd = new Date(new Date().getTime() - 1800 * 1000);
            let ed = new Date();
            ProfileData.userStepsData.shift();
            ProfileData.userStepsData.push(ProfileData.queryStepCount(sd, ed));
            GoalsPage.updateGraph();
        }, 60000 * 30);
    }
}