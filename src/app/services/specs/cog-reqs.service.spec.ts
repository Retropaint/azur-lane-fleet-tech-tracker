import { TestBed } from '@angular/core/testing';

import { CogReqsService } from './cog-reqs.service';

describe('CogReqsService', () => {
  let service: CogReqsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CogReqsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
