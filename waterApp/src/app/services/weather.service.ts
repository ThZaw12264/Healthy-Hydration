import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey: string = 'aaf16230ad3cc3d8f5af5e4fa7f9f4c6'; //openweatherapi key
  private apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather?lat=';
  private geoUrl: string = 'http://api.openweathermap.org/geo/1.0/zip?zip=';
  constructor(private http: HttpClient) { }

  private lat: number = 0;
  private long: number = 0;
  private city: string = "";


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

  async getWeatherByZipCode(zipCode: string, countryCode: string = 'us'): Promise<Observable<any>> {
    console.log("went in");
    try {
      await this.getLatAndLonFromZipCode(zipCode);
        
      return this.http.get(`${this.apiUrl}${this.lat}&lon=${this.long}&appid=${this.apiKey}`);
    } catch (error) {
      console.error('Error getting latitude and longitude:', error);
      throw error;
    }
  }
}