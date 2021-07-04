import { Component, Input, OnInit } from '@angular/core';
import { Period } from 'timelanes';
import { MockDataService } from './mock-data/mock-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'ngx-showcase';
  data: Period[] = [];

  constructor(private mockDataService: MockDataService) {
    // 
  }

  ngOnInit() {
    this.data = this.mockDataService.getMockPeriods();
  }

}
