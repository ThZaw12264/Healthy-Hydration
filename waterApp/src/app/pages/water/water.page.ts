import { Component, OnInit } from '@angular/core';
import { ProfileData } from '../profile/profile.data';

@Component({
  selector: 'app-water',
  templateUrl: './water.page.html',
  styleUrls: ['./water.page.scss'],
})
export class WaterPage implements OnInit {
  constructor(public profiledata: ProfileData) { }

  ngOnInit() { }
}
