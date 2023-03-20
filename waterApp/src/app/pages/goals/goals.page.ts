import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileData } from '../profile/profile.data';;

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
})
export class GoalsPage implements OnInit, OnDestroy {

  constructor(public profiledata: ProfileData) { }

  ngOnInit(): void {

    // initialize chart options:
    setTimeout(() => {
      this.profiledata.stepGraphOptions = {
        title: {
          text: 'Your Steps'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0].data;
            return params.value[1] + ' Steps';
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: function (value) {
              const date = new Date(value);
              let label;
              if (date.getHours() == 0) {
                label = date.getHours() + 12 + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + " AM";
              } else if (date.getHours() == 12) {
                label = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + " PM";
              } else if (date.getHours() < 12) {
                label = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + " AM";
              } else {
                label = date.getHours() - 12 + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + " PM";
              }
              return label;
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
        },
        series: [{
          name: 'Steps Data',
          type: 'bar',
          showSymbol: false,
          emphasis: {
            line: false,
          },
          data: this.profiledata.userStepsData,
          barWidth: 25
        }],
        grid: {
          containLabel: true
        }
      };
    }, 1000)

    this.displayStepsTitle();
  }

  ngOnDestroy() {
    clearInterval(this.profiledata.timer);
  }

  updateGraph() {
    setTimeout(() => {
      this.profiledata.stepGraphUpdateOptions = {
        series: [{
          data: this.profiledata.userStepsData
        }]
      };
      this.displayStepsTitle();
    }, 1000);
  }

  displayStepsTitle() {
    if (this.profiledata.userStepsGoalReached) {
      document.getElementById('stepsTitle')!.innerHTML = "You reached your Daily Step Goal!"
    } else {
      document.getElementById('stepsTitle')!.innerHTML = "Keep reaching your Daily Step Goal!"
    }
  }
}