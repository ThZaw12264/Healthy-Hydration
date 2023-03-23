import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileData } from '../pages/profile/profile.data';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey: string = 'aaf16230ad3cc3d8f5af5e4fa7f9f4c6'; //openweatherapi key
  private apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather?lat=';
  private geoUrl: string = 'http://api.openweathermap.org/geo/1.0/zip?zip=';

  constructor(private http: HttpClient, private profiledata: ProfileData) { }

  private lat: number = 0;
  private long: number = 0;
  private city: string = "";

  private kelvinTemp!: number;
  private humidity!: number;
  private temperature!: number;

  async getWeatherData() {
    let p = new Promise((resolve, reject) => {
      this.getWeatherByZipCode(this.profiledata.userZIPCode).then((weatherData$) => {
        weatherData$.subscribe((weatherData) => {
          console.log('Weather data:', weatherData);
          this.kelvinTemp = weatherData.main.temp;
          this.humidity = weatherData.main.humidity;
          this.temperature = (this.kelvinTemp - 273.15) * 9/5 + 32;
          return resolve({
            temperature: this.temperature, 
            humidity: this.humidity
          });
        }, (error) => {
          console.error('Error fetching weather data:', error);
        });
      }, error => {
        console.error('Error getting latitude and longitude:', error);
      });
    });

    p.then((response) => {
      return response;
    }).catch((error) => {
      return error;
    });

    return p;
  }

  async getLatAndLonFromZipCode(zipCode: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.get(`${this.geoUrl}${zipCode},US&appid=${this.apiKey}`).subscribe((response: any) => {
        this.lat = response.lat;
        this.long = response.lon;
        this.city = response.name;
        console.log("City: ", this.city);
        resolve();
      }, (error) => {
        console.error("Error", error);
        reject(error);
      });
    });
  }

  anotherFunction() {
    // Check if the latitude and longitude values are set
    if (this.lat !== undefined && this.long !== undefined) {
      console.log('Latitude:', this.lat);
      console.log('Longitude:', this.long);
      
      // You can use the latitude and longitude values here
    } else {
      console.log('Latitude and longitude are not set yet.');
    }
  }

  async getWeatherByZipCode(zipCode: number, countryCode: string = 'us'): Promise<Observable<any>> {
    console.log("went in");
    try {
      await this.getLatAndLonFromZipCode(zipCode.toString());
        
      return this.http.get(`${this.apiUrl}${this.lat}&lon=${this.long}&appid=${this.apiKey}`);
    } catch (error) {
      console.error('Error getting latitude and longitude:', error);
      throw error;
    }
  }
}