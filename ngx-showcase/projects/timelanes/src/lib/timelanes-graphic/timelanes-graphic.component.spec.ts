import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelanesGraphicComponent } from './timelanes-graphic.component';

describe('TimelanesCanvasComponent', () => {
  let component: TimelanesGraphicComponent;
  let fixture: ComponentFixture<TimelanesGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelanesGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelanesGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
