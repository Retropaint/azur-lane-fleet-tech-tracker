import { TestBed } from '@angular/core/testing';

import { AzurapiService } from '../azurapi.service';

describe('AzurapiService', () => {
  let service: AzurapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzurapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
