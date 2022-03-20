import { TestBed } from '@angular/core/testing';

import { ShipCategoryDataService } from '../ship-category-data.service';

describe('ShipCategoryDataService', () => {
  let service: ShipCategoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipCategoryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
