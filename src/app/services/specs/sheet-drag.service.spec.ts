import { TestBed } from '@angular/core/testing';

import { SheetDragService } from './sheet-drag.service';

describe('SheetDragService', () => {
  let service: SheetDragService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheetDragService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
