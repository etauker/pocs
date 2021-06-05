import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TimelanesModule } from 'timelanes';

import { AppComponent } from './app.component';
// import { TimelanesModule } from '../../projects/timelanes/src/lib/timelanes.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TimelanesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
