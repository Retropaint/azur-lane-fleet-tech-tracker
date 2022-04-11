import { TestBed } from '@angular/core/testing';

import { FactionTechDataService } from './faction-tech-data.service';

describe('FactionTechDataService', () => {
  let service: FactionTechDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactionTechDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
