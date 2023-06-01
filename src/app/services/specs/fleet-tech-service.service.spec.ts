import { TestBed } from '@angular/core/testing';

import { FleetTechServiceService } from './fleet-tech-service.service';

describe('FleetTechServiceService', () => {
  let service: FleetTechServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FleetTechServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
