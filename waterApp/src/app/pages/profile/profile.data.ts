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

    //steps
    public timer: any;
    //steps data for past 5 hours
    public userStepsData: any = [];
    public userDailyStepsCount: number = 0;
    public userStepsGoalReached: boolean = false;
    public stepGraphOptions: any;
    public stepGraphUpdateOptions: any;

    changeUserInfo() {
        this.userName = this.varName;
        this.userGender = this.varGender;
        this.userAge = this.varAge;
        this.userHeight = this.varHeight;
        this.userWeight = this.varWeight;
        this.userStepsGoal = this.varStepsGoal;
    }

    checkStepsGoalReached() {
        if (this.userDailyStepsCount >= this.userStepsGoal) { 
            this.userStepsGoalReached = true;
        } else {
            this.userStepsGoalReached = false;
        }
    }

    async queryStepCount(sd: Date, ed: Date) {
        var stepOptions = {
            startDate: sd,
            endDate: ed,
            sampleType: 'HKQuantityTypeIdentifierStepCount',
            unit: 'count'
        }
        let data = await this.healthKit.querySampleType(stepOptions);
        return data.reduce((a, b) => a + b.quantity, 0);
    }

    async loadTodayStepData() {
        let sd = new Date();
        sd.setHours(0, 0, 0, 0);
        let ed = new Date();

        this.userDailyStepsCount = await this.queryStepCount(sd,ed);
        this.checkStepsGoalReached();
    }

    //did not load 12:00AM steps into the graph or stepcount, possibly considered it yesterday's
    async load5HrStepData() {
        let rounded_date = new Date();
        rounded_date.setMinutes((Math.floor(rounded_date.getMinutes() / 30) * 30), 0, 0);
        
        for (let halfhour = 9; halfhour > 0; --halfhour) {
            let sd = new Date(rounded_date.getTime() - halfhour * 1800 * 1000);
            //ending date 100 milliseconds behind for no overlaps
            let ed = new Date(rounded_date.getTime() - (halfhour - 1) * 1800 * 1000 - 100);

            let stepSum = await this.queryStepCount(sd, ed);
            let stepDate = new Date(sd.getTime() + 15 * 60000);
            this.userStepsData.push({
                name: stepDate,
                value: [
                    [stepDate.getFullYear(), stepDate.getMonth() + 1, stepDate.getDate()].join('/') + 'T' + [stepDate.getHours(), stepDate.getMinutes()].join(':'),
                    stepSum
                ]
            });
        }

        let stepSum = await this.queryStepCount(rounded_date, new Date());
        let stepDate = new Date(rounded_date.getTime() + 15 * 60000);
        this.userStepsData.push({
            name: stepDate,
            value: [
                [stepDate.getFullYear(), stepDate.getMonth() + 1, stepDate.getDate()].join('/') + 'T' + [stepDate.getHours(), stepDate.getMinutes()].join(':'),
                stepSum
            ]
        });
    }

    async loadLiveStepData() {
        //updates every minute
        let sd = new Date(new Date().getTime() - 60000);
        //ending date 100 milliseconds behind for no overlaps
        let ed = new Date(new Date().getTime() - 100);
        let stepSum = await this.queryStepCount(sd, ed);
        let lastStepElement = this.userStepsData[this.userStepsData.length - 1];
        //add to userDayStepCount
        if (sd.getDay() == lastStepElement.name.getDay()) {
            this.userDailyStepsCount += stepSum;
        } else {
            this.userDailyStepsCount = stepSum;
        }
        this.checkStepsGoalReached();

        //add steps to most recent date if within range, otherwise create a new bar
        if (sd.getTime() < lastStepElement.name.getTime() + 15 * 60000) {
            this.userStepsData[this.userStepsData.length - 1].value[1] += stepSum;
        } else {
            let stepDate = sd;
            stepDate.setMinutes((Math.floor(stepDate.getMinutes() / 30) * 30) + 15 , 0, 0);
            this.userStepsData.push({
                name: stepDate,
                value: [
                    [stepDate.getFullYear(), stepDate.getMonth() + 1, stepDate.getDate()].join('/') + 'T' + [stepDate.getHours(), stepDate.getMinutes()].join(':'),
                    Math.round(stepSum)
                ]
            });
        }
    }
}