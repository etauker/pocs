import { NgModule } from '@angular/core';
import { TimelanesComponent } from './timelanes/timelanes.component';
import { TimelanesGraphicComponent } from './timelanes-graphic/timelanes-graphic.component';
import { MockDataService } from './mock-data/mock-data.service';

@NgModule({
  imports: [
  ],
  declarations: [TimelanesComponent, TimelanesGraphicComponent],
  exports: [TimelanesComponent],
  providers: [MockDataService]
})
export class TimelanesModule { }
