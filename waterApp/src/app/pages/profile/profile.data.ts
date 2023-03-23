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
    public varDistanceGoal!: number;
    public varNrgBurnedGoal!: number;
    public varZIPCode!: number;
    //saved body data used for calculations
    public userName!: string;
    public userGender!: string;
    public userAge!: number;
    public userHeight!: number;
    public userWeight!: number;
    public userStepsGoal!: number;
    public userDistanceGoal!: number;
    public userNrgBurnedGoal!: number;
    public userZIPCode!: number;

    //water
    public hydrationScore: number = 5;
    public bodyWaterContent: number = 60;
    public waterAmount: number = 2600;

    //weather
    public humidity!: number;
    public temperature!: number;
    
    //steps
    public timer: any;
    //steps data for past 6 hours
    public userStepsData: any = [];
    public userDailyStepsCount: number = 0;
    //public userStepsGoalReached: boolean = false;
    public stepGraphOptions: any;
    public stepGraphUpdateOptions: any;
    //distance
    public userDistanceData: any = [];
    public userDailyDistanceCount: number = 0;
    public distanceGraphOptions: any;
    public distanceGraphUpdateOptions: any;
    //energy
    public userNrgBurnedData: any = [];
    public userDailyNrgBurnedCount: number = 0;
    public nrgBurnedGraphOptions: any;
    public nrgBurnedGraphUpdateOptions: any;

    changeUserInfo() {
        this.userName = this.varName;
        this.userGender = this.varGender;
        this.userAge = this.varAge;
        this.userHeight = this.varHeight;
        this.userWeight = this.varWeight;
        this.userStepsGoal = this.varStepsGoal;
        this.userDistanceGoal = this.varDistanceGoal;
        this.userNrgBurnedGoal = this.varNrgBurnedGoal;
        this.userZIPCode = this.varZIPCode;
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

    async queryDistanceWent(sd: Date, ed: Date) {
        var distanceOptions = {
            startDate: sd,
            endDate: ed,
            sampleType: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
            distanceUnit: 'km'
        }
        let data = await this.healthKit.querySampleType(distanceOptions);
        return data.reduce((a, b) => a + b.quantity, 0);
    }

    async queryEnergyBurned(sd: Date, ed: Date) {
        var energyOptions = {
            startDate: sd,
            endDate: ed,
            sampleType: 'HKQuantityTypeIdentifierActiveEnergyBurned',
            energyUnit: 'cal'
        }
        let data = await this.healthKit.querySampleType(energyOptions);
        return data.reduce((a, b) => a + b.quantity, 0);
    }

    async loadTodaysData() {
        let sd = new Date();
        sd.setHours(0, 0, 0, 0);
        let ed = new Date();

        this.userDailyStepsCount = await this.queryStepCount(sd, ed);
        this.userDailyDistanceCount = await this.queryDistanceWent(sd, ed);
        this.userDailyNrgBurnedCount = await this.queryEnergyBurned(sd, ed);
    }

    pushUserData(startDate: Date, stepSum: number, distanceSum: number, nrgBurnedSum: number) {
        let graphDate = new Date(startDate.getTime() + 15 * 60000);
        this.userStepsData.push([graphDate, stepSum]);
        this.userDistanceData.push([graphDate, distanceSum]);
        this.userNrgBurnedData.push([graphDate, nrgBurnedSum]);
    }

    //did not load 12:00AM steps into the graph or stepcount, possibly considered it yesterday's
    async loadLast6HrsData() {
        let rounded_date = new Date();
        rounded_date.setMinutes((Math.floor(rounded_date.getMinutes() / 30) * 30), 0, 0);

        for (let halfhour = 11; halfhour > 0; --halfhour) {
            let sd = new Date(rounded_date.getTime() - halfhour * 1800 * 1000);
            //ending date 100 milliseconds behind for no overlaps
            let ed = new Date(rounded_date.getTime() - (halfhour - 1) * 1800 * 1000 - 100);

            let stepSum = await this.queryStepCount(sd, ed);
            let distanceSum = await this.queryDistanceWent(sd, ed);
            let nrgBurnedSum = await this.queryEnergyBurned(sd, ed);

            this.pushUserData(sd, stepSum, distanceSum, nrgBurnedSum);
        }

        let stepSum = await this.queryStepCount(rounded_date, new Date());
        let distanceSum = await this.queryDistanceWent(rounded_date, new Date());
        let nrgBurnedSum = await this.queryEnergyBurned(rounded_date, new Date());
        this.pushUserData(rounded_date, stepSum, distanceSum, nrgBurnedSum);
    }

    async loadLiveData(updateGraphCallBack: Function) {
        let sd = new Date(new Date().getTime() - 60000);
        let ed = new Date(new Date().getTime() - 100);

        let stepSum = await this.queryStepCount(sd, ed);
        let distanceSum = await this.queryDistanceWent(sd, ed);
        let nrgBurnedSum = await this.queryEnergyBurned(sd, ed);
        let lastTime = this.userStepsData[this.userStepsData.length - 1].name;
        //add to user daily counts
        if (sd.getDay() == lastTime.getDay()) {
            this.userDailyStepsCount += stepSum;
            this.userDailyDistanceCount += distanceSum;
            this.userDailyNrgBurnedCount += nrgBurnedSum;
        } else {
            this.userDailyStepsCount = stepSum;
        }
        //add steps to most recent date if within range, otherwise create a new bar
        if (sd.getTime() < lastTime.getTime() + 15 * 60000) {
            this.userStepsData[this.userStepsData.length - 1].value[1] += stepSum;
            this.userDistanceData[this.userDistanceData.length - 1].value[1] += distanceSum;
            this.userNrgBurnedData[this.userNrgBurnedData.length - 1].value[1] += nrgBurnedSum;
        } else {
            sd.setMinutes((Math.floor(sd.getMinutes() / 30) * 30) + 15, 0, 0);
            this.userStepsData.shift();
            this.userDistanceData.shift();
            this.userNrgBurnedData.shift();
            this.pushUserData(sd, stepSum, distanceSum, nrgBurnedSum);
        }
        updateGraphCallBack();
    }

    async queryYesterdayNrgBurned() {
        let sd = new Date();
        sd.setDate(sd.getDate() - 1);
        sd.setHours(0, 0, 0, 0);
        let ed = new Date();
        ed.setHours(0, 0, 0, 0);

        return this.queryEnergyBurned(sd,ed);
    }
}