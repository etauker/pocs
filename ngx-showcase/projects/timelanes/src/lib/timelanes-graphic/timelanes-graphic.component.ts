import * as moment_ from 'moment';
const moment = moment_;

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TimelanesGraphic } from '../classes/timelanes-graphic';
import { Period } from '../model/period.interface';
import { MockDataService } from '../mock-data/mock-data.service';

@Component({
  selector: 'lib-timelanes-graphic',
  templateUrl: './timelanes-graphic.component.html',
  styleUrls: ['./timelanes-graphic.component.scss']
})
export class TimelanesGraphicComponent implements OnInit, AfterViewInit {

  constructor(private mockDataService: MockDataService) { }

  ngAfterViewInit() {

    // needed to calculate percent-based SVG height and width
    setTimeout(() => this.init(), 10);
  }
  
  ngOnInit() { }

  private init() {
    // source: https://www.youtube.com/watch?v=TOJ9yjvlapY
    // tooltip source: https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html


    // format data
    const PERIODS: Period[] = this.mockDataService.getMockPeriods();

    const timeline = new TimelanesGraphic({
      svg: 'visual',
      tooltip: 'tooltip'
    }, PERIODS, {
      timelaneStyle: {
          backgroundColour: 'wheat',

          borderColour: 'darkgrey',
          borderWidth: '3px',
          borderStyle: 'solid',

          // TODO: implement for days
          fillStyle: 'line-dashed',
          fillColour: 'yellow',
          lineWidth: '7px',
      },
      backgroundColour: 'yellowgreen',
      borderColour: 'silver',
      borderWidth: '5px',
      borderStyle: 'dashed',
    });
  }

}
