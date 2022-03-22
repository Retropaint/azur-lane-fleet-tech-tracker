import { TestBed } from '@angular/core/testing';

import { DragFuncsService } from './drag-funcs.service';

describe('DragFuncsService', () => {
  let service: DragFuncsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DragFuncsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
