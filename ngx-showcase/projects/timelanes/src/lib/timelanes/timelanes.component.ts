// import * as moment_ from 'moment';
// const moment = moment_;
import { Component, Input, OnInit } from '@angular/core';
import { Period } from '../model/period.interface';
// import { TimelanesGraphic } from './classes/timelanes-graphic';

@Component({
  selector: 'lib-timelanes',
  templateUrl: './timelanes.component.html',
  styleUrls: ['./timelanes.component.css']
})
export class TimelanesComponent implements OnInit {

  @Input('data')
  periods: Period[] = [];

  constructor() { }

  ngOnInit() {

  }

}
