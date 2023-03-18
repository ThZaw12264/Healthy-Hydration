import { Injectable } from '@angular/core';
import { HealthKit } from '@ionic-native/health-kit/ngx';

@Injectable({
    providedIn: 'root'
})
export class ProfileData {
    public healthKit!: HealthKit
    //ng variable, not used for calculations
    public varName!: string;
    public varGender!: string;
    public varAge!: number;
    public varHeight!: number;
    public varWeight!: number;
    public varStepsGoal!: number;
    //saved body data used for calculations
    public userName!: string;
    public userGender!: string;
    public userAge!: number;
    public userHeight!: number;
    public userWeight!: number;
    public userStepsGoal!: number;

    //step count for past 4 hours
    public timer: any;
    public userStepsData: any = [];
    public userDailyStepsCount: number = 0;
    public userStepsGoalReached: boolean = false;

    changeUserInfo() {
        this.userName = this.varName;
        this.userGender = this.varGender;
        this.userAge = this.varAge;
        this.userHeight = this.varHeight;
        this.userWeight = this.varWeight;
        this.userStepsGoal = this.varStepsGoal;
    }

    queryStepCount(sd: Date, ed: Date) {
        var stepOptions = {
            startDate: sd,
            endDate: ed,
            sampleType: 'HKQuantityTypeIdentifierStepCount',
            unit: 'count'
        }

        this.healthKit.querySampleType(stepOptions).then(data => {
            let stepSum = data.reduce((a, b) => a + b.quantity, 0);

            this.userStepsData.push({
                name: sd,
                value: [
                    [sd.getFullYear(), sd.getMonth() + 1, sd.getDate()].join('/') + 'T' + [sd.getHours(), sd.getMinutes()].join(':'),
                    Math.round(stepSum)
                ]
            });
        }, err => {
            console.log('No steps: ', err);
        });
    }

    loadTodayStepData() {
        let sd = new Date();
        sd.setHours(0, 0, 0);
        let ed = new Date();

        var stepOptions = {
            startDate: sd,
            endDate: ed,
            sampleType: 'HKQuantityTypeIdentifierStepCount',
            unit: 'count'
        }

        this.healthKit.querySampleType(stepOptions).then(data => {
            let stepSum = data.reduce((a, b) => a + b.quantity, 0);
            this.userDailyStepsCount = stepSum;
            if (this.userDailyStepsCount >= this.userStepsGoal) { 
                this.userStepsGoalReached = true;
            }
        }, err => {
            console.log('No steps: ', err);
        });
    }

    load4HrStepData() {
        let rounded_date = new Date();
        rounded_date.setMinutes((Math.floor(rounded_date.getMinutes() / 30) * 30), 0);
        for (let halfhour = 7; halfhour > 0; --halfhour) {
            let sd = new Date(rounded_date.getTime() - halfhour * 1800 * 1000);
            //ending date 1 second behind for no overlaps
            let ed = new Date(rounded_date.getTime() - (halfhour - 1) * 1800 * 1000 - 1000);
            this.queryStepCount(sd, ed);
        }
        this.queryStepCount(rounded_date, new Date());
    }

    loadLiveStepData() {
        //updates every minute
        let sd = new Date(new Date().getTime() - 60000);
        //ending date 1 second behind for no overlaps
        let ed = new Date(new Date().getTime() - 1000);

        var stepOptions = {
            startDate: sd,
            endDate: ed,
            sampleType: 'HKQuantityTypeIdentifierStepCount',
            unit: 'count'
        }

        this.healthKit.querySampleType(stepOptions).then(data => {
            let stepSum = data.reduce((a, b) => a + b.quantity, 0);
            let lastStepElement = this.userStepsData[this.userStepsData.length - 1];
            //add to userDayStepCount
            if (sd.getHours() >= lastStepElement.name.getHours()) {
                this.userDailyStepsCount += stepSum;
                if (this.userDailyStepsCount >= this.userStepsGoal) { 
                    this.userStepsGoalReached = true; 
                }
            } else {
                this.userStepsGoalReached = false; 
                this.userDailyStepsCount = stepSum;
                if (this.userDailyStepsCount >= this.userStepsGoal) { 
                    this.userStepsGoalReached = true; 
                }
            }

            //add steps to most recent date if within range, otherwise create a new bar
            if (sd.getMinutes() < lastStepElement.name.getMinutes() || sd.getMinutes() >= lastStepElement.name.getMinutes() + 30) {
                let rounded_date = sd;
                rounded_date.setMinutes(Math.floor(rounded_date.getMinutes() / 30) * 30 , 0);
                this.userStepsData.push({
                    name: rounded_date,
                    value: [
                        [rounded_date.getFullYear(), rounded_date.getMonth() + 1, rounded_date.getDate()].join('/') + 'T' + [rounded_date.getHours(), rounded_date.getMinutes()].join(':'),
                        Math.round(stepSum)
                    ]
                });
            } else {
                this.userStepsData[this.userStepsData.length - 1].value[1] += stepSum;
            }
        }, err => {
            console.log('No steps: ', err);
        });
    }
}