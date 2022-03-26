import { TestBed } from '@angular/core/testing';

import { HoverTitlesService } from './hover-titles.service';

describe('HoverTitlesService', () => {
  let service: HoverTitlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoverTitlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
