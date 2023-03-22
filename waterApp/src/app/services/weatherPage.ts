import { Injectable } from '@angular/core';
import { ProfileData } from '../pages/profile/profile.data';
import { WeatherService } from '../services/weather.service';

@Injectable({
    providedIn: 'root'
})
export class WeatherPage {
  private zipCode: string = "";
  private kelvinTemp: number = 0;

  constructor(private weatherService: WeatherService, private profiledata: ProfileData) { }

  async getWeatherData() {
    try {
      const weatherData$ = await this.weatherService.getWeatherByZipCode(this.zipCode);
      weatherData$.subscribe((weatherData) => {
        console.log('Weather data:', weatherData);
        this.kelvinTemp = weatherData.main.temp;
        this.profiledata.humidity = weatherData.main.humid;
        this.profiledata.temperature = (this.kelvinTemp - 273.15) * 9/5 + 32;
      }, (error) => {
        console.error('Error fetching weather data:', error);
      });
    } catch (error) {
      console.error('Error getting latitude and longitude:', error);
    }
  }
}