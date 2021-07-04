import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TimelanesModule } from 'timelanes';

import { AppComponent } from './app.component';
import { MockDataService } from './mock-data/mock-data.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TimelanesModule,
  ],
  providers: [MockDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
