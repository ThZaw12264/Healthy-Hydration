import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  zipCode: string = "";
  weatherData: any;
  
  //data from API call involving temperature
  private kelvinTemp: number = 0;
  private humid: number = 0;
  private newTemp: number = 0;

  constructor(private weatherService: WeatherService) { }

  async getWeatherData() {
    try {
      const weatherData$ = await this.weatherService.getWeatherByZipCode(this.zipCode);
      weatherData$.subscribe((weatherData) => {
        console.log('Weather data:', weatherData);
        this.weatherData = weatherData;
        this.kelvinTemp = this.weatherData.main.temp;
        this.humid = this.weatherData.main.humid;
        this.newTemp = (this.kelvinTemp - 273.15) * 9/5 + 32;
      }, (error) => {
        console.error('Error fetching weather data:', error);
      });
    } catch (error) {
      console.error('Error getting latitude and longitude:', error);
    }
  }
}
