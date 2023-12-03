import { NgModule } from '@angular/core';
import { TimelanesComponent } from './timelanes/timelanes.component';
import { TimelanesGraphicComponent } from './timelanes-graphic/timelanes-graphic.component';
import { TooltipComponent } from './tooltip/tooltip.component';

export * from './model/period.interface';

@NgModule({
  imports: [
  ],
  declarations: [
    TimelanesComponent,
    TimelanesGraphicComponent,
    TooltipComponent
  ],
  exports: [
    TimelanesComponent
  ],
  providers: []
})
export class TimelanesModule { }
