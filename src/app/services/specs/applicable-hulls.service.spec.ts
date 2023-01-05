import { TestBed } from '@angular/core/testing';

import { ApplicableHullsService } from './applicable-hulls.service';

describe('ApplicableHullsService', () => {
  let service: ApplicableHullsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicableHullsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
