import { NgModule } from '@angular/core';
import { TimelanesComponent } from './timelanes/timelanes.component';
import { TimelanesGraphicComponent } from './timelanes-graphic/timelanes-graphic.component';

@NgModule({
  imports: [
  ],
  declarations: [TimelanesComponent, TimelanesGraphicComponent],
  exports: [TimelanesComponent]
})
export class TimelanesModule { }
