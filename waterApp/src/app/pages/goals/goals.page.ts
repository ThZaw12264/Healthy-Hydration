import { Component, OnInit} from '@angular/core';

import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
})
export class GoalsPage implements OnInit {
  options: any;
  updateOptions: any;

  constructor() { }

  ngOnInit(): void {

    // initialize chart options:
    this.options = {
      title: {
        text: 'Dynamic Data + Time Axis'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          params = params[0];
          const date = new Date(params.name);
          return date.getHours() + ':' + (date.getMinutes()) + ':' + date.getSeconds() + ': ' + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: function (value) {
            let label;
            const date = new Date(value);
            if (date.getHours() == 0) {
              label = date.getHours() + 12 + ":0" + date.getMinutes() + " AM";
            } else if (date.getHours() == 12) {
              label = date.getHours() + ":0" + date.getMinutes() + " PM";
            } else if (date.getHours() < 12) {
              label = date.getHours() + ":0" + date.getMinutes() + " AM";
            } else {
              label = date.getHours() - 12 + ":0" + date.getMinutes() + " PM";
            }
            return label;
          }
        },
        splitLine: {
          show: true
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true
        }
      },
      series: [{
        name: 'Mocking Data',
        type: 'bar',
        showSymbol: false,
        emphasis: {
          line: false,
        },
        data: ProfilePage.userStepsData
      }]
    };
  }

  public updateGraph() {
    this.updateOptions = {
      series: [{
        data: ProfilePage.userStepsData
      }]
    };
  }
}