import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileData } from '../profile/profile.data';;

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
})
export class GoalsPage implements OnInit, OnDestroy {
  options: any;
  updateOptions: any;

  constructor(private profiledata: ProfileData) { }

  ngOnInit(): void {

    // initialize chart options:
    setTimeout(() => {
      this.options = {
        title: {
          text: 'Your Steps'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            params = params[0];
            const date = new Date(params.name);
            let label;
            if (date.getHours() == 0) {
              label = date.getHours() + 12 + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + " AM" + ' : ' + params.value[1];
            } else if (date.getHours() == 12) {
              label = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + " PM" + ' : ' + params.value[1];
            } else if (date.getHours() < 12) {
              label = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + " AM" + ' : ' + params.value[1];
            } else {
              label = date.getHours() - 12 + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + " PM" + ' : ' + params.value[1];
            }
            return label;
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
          data: this.profiledata.userStepsData
        }]
      };
    }, 1000)
  }

  ngOnDestroy() {
    clearInterval(this.profiledata.timer);
  }

  updateGraph() {
    this.updateOptions = {
      series: [{
        data: this.profiledata.userStepsData
      }]
    };
  }
}