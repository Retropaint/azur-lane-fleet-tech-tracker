import { TestBed } from '@angular/core/testing';

import { ShortenedNamesService } from './shortened-names.service';

describe('ShortenedNamesService', () => {
  let service: ShortenedNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortenedNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
