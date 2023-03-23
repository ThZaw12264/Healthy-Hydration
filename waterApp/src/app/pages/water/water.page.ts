import { Component, OnInit } from '@angular/core';
import { ProfileData } from '../profile/profile.data';
import { WeatherService } from 'src/app/services/weather.service';
import { AppComponent } from 'src/app/app.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-water',
  templateUrl: './water.page.html',
  styleUrls: ['./water.page.scss'],
})
export class WaterPage implements OnInit {
  constructor(public profiledata: ProfileData, private weather: WeatherService, private myapp: AppComponent) { }

  ngOnInit() { }

  recommendWater() {
    //create {} with the fields
    //find activity time by querying yesterday's energy burned
    //replace yesterday's temp and humidity with current
    //score = profiledata.hydrationScore, set profiledata.hydrationScore = 5 default
    //body water = profiledata.bodyWaterContent, set profiledata.bodyWaterContent = default
    //date = yesterday's Date
    //stringify json and add to storage json
    
    //should be yesterday's average weather
    this.weather.getWeatherData().then((wd: any) => {
      //let activityTime = this.profiledata.queryYesterdayNrgBurned;
      let activityTime = 600;
      let dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - 1);
      let date = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
      let userJSONObject = {
        "date": date,
        "body_water": this.profiledata.bodyWaterContent,
        "water_drank": this.profiledata.waterAmount,
        "activity_time": activityTime,
        "avg_temp": wd.temperature,
        "avg_hum": wd.humidity,
        "score": this.profiledata.hydrationScore
      }

      this.myapp.loadJSONData().then((userJSONData) => {
        userJSONData.push(userJSONObject);
        this.myapp.saveJSONData(userJSONData);

        //should be today's average weather
        let recommenderJSON = {
          "current": {
            "avg_temp": wd.temperature,
            "avg_hum": wd.humidity
          },
          "prev": userJSONData
        }

        $.post({
          type: "POST",
          contentType: "application/json",
          url: 'http://localhost:5000',
          data: JSON.stringify(recommenderJSON),
          dataType: "json",
          success:(data) => {this.profiledata.waterAmount = Math.round(data.result);}
        });
      });
    });

    //make weather api call for today
    //parse json string stored in storage and declare as prev
    //send post request with current weather data and prev
    //receive water amount, update profile.data.waterAmount

  }
}
