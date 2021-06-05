import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelanesComponent } from './timelanes.component';

describe('TimelanesComponent', () => {
  let component: TimelanesComponent;
  let fixture: ComponentFixture<TimelanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
