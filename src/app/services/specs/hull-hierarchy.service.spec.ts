import { TestBed } from '@angular/core/testing';

import { HullHierarchyService } from './hull-hierarchy.service';

describe('HullHierarchyService', () => {
  let service: HullHierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HullHierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
