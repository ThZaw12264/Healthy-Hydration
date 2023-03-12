import { Component, OnInit } from '@angular/core';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-water',
  templateUrl: './water.page.html',
  styleUrls: ['./water.page.scss'],
})
export class WaterPage implements OnInit {
  profileReference = ProfilePage;
  
  constructor() {}

  ngOnInit() {}
}
