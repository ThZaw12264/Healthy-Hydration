import { Component, OnInit } from '@angular/core';
import { ProfileData } from '../profile/profile.data';
import { WeatherPage } from 'src/app/services/weatherPage';

@Component({
  selector: 'app-water',
  templateUrl: './water.page.html',
  styleUrls: ['./water.page.scss'],
})
export class WaterPage implements OnInit {
  constructor(public profiledata: ProfileData, private weatherpage: WeatherPage) { }

  ngOnInit() { }

  recommendWater() {
    //make weather api call for today
    //parse json string stored in storage and declare as prev
    //send post request with current weather data and prev
    //receive water amount, update profile.data.waterAmount

    this.profiledata.waterAmount = 2718;
    
    //this.weatherpage.getWeatherData();


    //create {} with the fields
    //find activity time by querying yesterday's energy burned
    //replace yesterday's temp and humidity with current
    //score = profiledata.hydrationScore, set profiledata.hydrationScore = 5 default
    //body water = profiledata.bodyWaterContent, set profiledata.bodyWaterContent = default
    //date = yesterday's Date
  }
}
