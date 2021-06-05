import { TestBed } from '@angular/core/testing';

import { TimelanesService } from './timelanes.service';

describe('TimelanesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimelanesService = TestBed.get(TimelanesService);
    expect(service).toBeTruthy();
  });
});
